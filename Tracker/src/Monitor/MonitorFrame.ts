require('dotenv').config();
import {
    Connection,
    PublicKey,
    ParsedTransactionWithMeta,
    ParsedInstruction,
    PartiallyDecodedInstruction,
    ParsedInnerInstruction,
  } from '@solana/web3.js';
  import bs58 from 'bs58';
  import { LiquidityPoolKeys, Liquidity,  MARKET_STATE_LAYOUT_V3, Market, LiquidityPoolKeysV4, ApiPoolInfoV4, LIQUIDITY_STATE_LAYOUT_V4, SPL_MINT_LAYOUT, jsonInfo2PoolKeys } from '@raydium-io/raydium-sdk';
  import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import assert from 'assert';


export abstract class MonitorFrame {
    protected readonly connection: Connection;
    protected readonly programAddress: PublicKey;
    protected readonly processedTransactions: Set<string>;
  
    public readonly SERUM_OPENBOOK_PROGRAM_ID = 'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX';
    public readonly SOL_MINT: PublicKey = new PublicKey('So11111111111111111111111111111111111111112');
    public readonly SOL_DECIMALS = 9;
  
    constructor(connectionUrl: string, programPublicKey: string) {
      try {
        this.connection = new Connection(connectionUrl, { commitment: 'confirmed' });
        this.programAddress = new PublicKey(programPublicKey);
        this.processedTransactions = new Set();
      } catch (error) {
        console.error('Error in constructor:', error);
        throw error;
      }
    }



    // public methods --------------------------------------------------
  
    async getPoolKeysAll(tx: ParsedTransactionWithMeta) {
      try {
        const poolInfo = await this._getAssociatedPoolKeys(tx);
        const marketInfo = await this._fetchMarketInfo(poolInfo.marketId);
        return {
          id: poolInfo.id,
          baseMint: poolInfo.baseMint,
          quoteMint: poolInfo.quoteMint,
          lpMint: poolInfo.lpMint,
          baseDecimals: poolInfo.baseDecimals,
          quoteDecimals: poolInfo.quoteDecimals,
          lpDecimals: poolInfo.lpDecimals,
          version: 4,
          programId: poolInfo.programId,
          authority: poolInfo.authority,
          openOrders: poolInfo.openOrders,
          targetOrders: poolInfo.targetOrders,
          baseVault: poolInfo.baseVault,
          quoteVault: poolInfo.quoteVault,
          withdrawQueue: poolInfo.withdrawQueue,
          lpVault: poolInfo.lpVault,
          marketVersion: 3,
          marketProgramId: poolInfo.marketProgramId,
          marketId: poolInfo.marketId,
          marketAuthority: Market.getAssociatedAuthority({programId: poolInfo.marketProgramId, marketId: poolInfo.marketId}).publicKey,
          marketBaseVault: marketInfo.baseVault,
          marketQuoteVault: marketInfo.quoteVault,
          marketBids: marketInfo.bids,
          marketAsks: marketInfo.asks,
          marketEventQueue: marketInfo.eventQueue,
      } as LiquidityPoolKeysV4;
      } catch (error) {
        console.error('Error in getPoolKeysAll:', error);
        throw error;
      }
      
    }
  
    decodeLiquidity(tx: ParsedTransactionWithMeta | null, tokenA: PublicKey): number | string {
      try {
        const firstTokenSol = (tokenA.equals(this.SOL_MINT)) ? true : false;
        
        const instructionsLiquidity = tx?.transaction.message.instructions[4] as PartiallyDecodedInstruction;
        const liquidityData = instructionsLiquidity.data;
  
        const decodedBytes = Buffer.from(bs58.decode(liquidityData)).reverse();
        let pcTokensAmount;
        if (firstTokenSol) {
          const firstSubstring = decodedBytes.slice(0, 8).toString('hex');
          pcTokensAmount = parseInt(firstSubstring, 16);
        }
        else{
          const secondSubstring = decodedBytes.slice(8, 16).toString('hex');
          pcTokensAmount = parseInt(secondSubstring, 16);
        }
        
        return pcTokensAmount / 10 ** 9;
        
      } catch (error) {
        console.error('Error decoding bs58 data:', error);
        return '--';
      }
    }

    async getAllKeysTwo(tokenMint: string){
      const targetPoolInfo = await this._formatAmmKeysById(tokenMint)
      assert(targetPoolInfo, 'cannot find the target pool')
      const poolKeys = jsonInfo2PoolKeys(targetPoolInfo) as LiquidityPoolKeys
      return poolKeys;
    }
    
    // private methods -------------------------------------------------

    private async _getAssociatedPoolKeys(tx: ParsedTransactionWithMeta) {
      try {
        const initInstruction = this._findInstructionByProgramId(tx.transaction.message.instructions, new PublicKey(this.programAddress)) as PartiallyDecodedInstruction|null;

        
        if (!initInstruction) {
            throw new Error('Failed to find lp init instruction in lp init tx');
        }

        const baseMint = initInstruction.accounts[8];
        const baseVault = initInstruction.accounts[10]; 
        const quoteMint = initInstruction.accounts[9];
        const quoteVault = initInstruction.accounts[11];
        const lpMint = initInstruction.accounts[7];
        const baseAndQuoteSwapped = baseMint.toBase58() === this.SOL_MINT.toBase58();
        const lpMintInitInstruction = this._findInitializeMintInInnerInstructionsByMintAddress(tx.meta?.innerInstructions ?? [], lpMint);
        if (!lpMintInitInstruction) {
            throw new Error('Failed to find lp mint init instruction in lp init tx');
        }
        const lpMintInstruction = this._findMintToInInnerInstructionsByMintAddress(tx.meta?.innerInstructions ?? [], lpMint);
        if (!lpMintInstruction) {
            throw new Error('Failed to find lp mint to instruction in lp init tx');
        }
        const baseTransferInstruction = this._findTransferInstructionInInnerInstructionsByDestination(tx.meta?.innerInstructions ?? [], baseVault, TOKEN_PROGRAM_ID);
        if (!baseTransferInstruction) {
            throw new Error('Failed to find base transfer instruction in lp init tx');
        }
        const quoteTransferInstruction = this._findTransferInstructionInInnerInstructionsByDestination(tx.meta?.innerInstructions ?? [], quoteVault, TOKEN_PROGRAM_ID);
        if (!quoteTransferInstruction) {
            throw new Error('Failed to find quote transfer instruction in lp init tx');
        }
        const lpDecimals = lpMintInitInstruction.parsed.info.decimals;
        const lpInitializationLogEntryInfo = this._extractLPInitializationLogEntryInfoFromLogEntry(this._findLogEntry('init_pc_amount', tx.meta?.logMessages ?? []) ?? '');
        const basePreBalance = (tx.meta?.preTokenBalances ?? []).find(balance => balance.mint === baseMint.toBase58());
        if (!basePreBalance) {
            throw new Error('Failed to find base tokens preTokenBalance entry to parse the base tokens decimals');
        }
        const baseDecimals = basePreBalance.uiTokenAmount.decimals;

        return {
            id: initInstruction.accounts[4],
            baseMint,
            quoteMint,
            lpMint,
            baseDecimals: baseAndQuoteSwapped ? this.SOL_DECIMALS : baseDecimals,
            quoteDecimals: baseAndQuoteSwapped ? baseDecimals : this.SOL_DECIMALS,
            lpDecimals,
            version: 4,
            programId: new PublicKey(this.programAddress),
            authority: initInstruction.accounts[5],
            openOrders: initInstruction.accounts[6],
            targetOrders: initInstruction.accounts[12],
            baseVault,
            quoteVault,
            withdrawQueue: new PublicKey("11111111111111111111111111111111"),
            lpVault: new PublicKey(lpMintInstruction.parsed.info.account),
            marketVersion: 3,
            marketProgramId: initInstruction.accounts[15],
            marketId: initInstruction.accounts[16],
            baseReserve: parseInt(baseTransferInstruction.parsed.info.amount),
            quoteReserve: parseInt(quoteTransferInstruction.parsed.info.amount),
            lpReserve: parseInt(lpMintInstruction.parsed.info.amount),
            openTime: lpInitializationLogEntryInfo.open_time,
        }
  
  
      } catch (error) {
        console.error('Error in getAssociatedPoolKeys:', error);
        throw error;
      }    
    }
  
    private _findLogEntry(needle: string, logEntries: Array<string>) : string|null
    {
        for (let i = 0; i < logEntries.length; ++i) {
            if (logEntries[i].includes(needle)) {
                return logEntries[i];
            }
        }
  
        return null;
    }
  
    private _extractLPInitializationLogEntryInfoFromLogEntry(lpLogEntry: string) : {nonce: number, open_time: number, init_pc_amount: number, init_coin_amount: number} {
      const lpInitializationLogEntryInfoStart = lpLogEntry.indexOf('{');
  
      return JSON.parse(this._fixRelaxedJsonInLpLogEntry(lpLogEntry.substring(lpInitializationLogEntryInfoStart)));
    }
  
    private _fixRelaxedJsonInLpLogEntry(relaxedJson: string) : string
    {
        return relaxedJson.replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, "$1\"$2\":");
    }
  
    private _findTransferInstructionInInnerInstructionsByDestination(innerInstructions: Array<ParsedInnerInstruction>, destinationAccount : PublicKey, programId?: PublicKey) : ParsedInstruction|null
    {
        for (let i = 0; i < innerInstructions.length; i++) {
            for (let y = 0; y < innerInstructions[i].instructions.length; y++) {
                const instruction = innerInstructions[i].instructions[y] as ParsedInstruction;
                if (!instruction.parsed) {continue};
                if (instruction.parsed.type === 'transfer' && instruction.parsed.info.destination === destinationAccount.toBase58() && (!programId || instruction.programId.equals(programId))) {
                    return instruction;
                }
            }
        }
  
        return null;
    }
  
    private _findMintToInInnerInstructionsByMintAddress(innerInstructions: Array<ParsedInnerInstruction>, mintAddress: PublicKey) : ParsedInstruction|null
    {
        for (let i = 0; i < innerInstructions.length; i++) {
            for (let y = 0; y < innerInstructions[i].instructions.length; y++) {
                const instruction = innerInstructions[i].instructions[y] as ParsedInstruction;
                if (!instruction.parsed) {continue};
                if (instruction.parsed.type === 'mintTo' && instruction.parsed.info.mint === mintAddress.toBase58()) {
                    return instruction;
                }
            }
        }
  
        return null;
    }
  
    private _findInitializeMintInInnerInstructionsByMintAddress(innerInstructions: Array<ParsedInnerInstruction>, mintAddress: PublicKey) : ParsedInstruction|null
    {
        for (let i = 0; i < innerInstructions.length; i++) {
            for (let y = 0; y < innerInstructions[i].instructions.length; y++) {
                const instruction = innerInstructions[i].instructions[y] as ParsedInstruction;
                if (!instruction.parsed) {continue};
                if (instruction.parsed.type === 'initializeMint' && instruction.parsed.info.mint === mintAddress.toBase58()) {
                    return instruction;
                }
            }
        }
  
        return null;
    }
  
    private _findInstructionByProgramId(instructions: Array<ParsedInstruction|PartiallyDecodedInstruction>, programId: PublicKey) : ParsedInstruction|PartiallyDecodedInstruction|null
    {
      for (let i = 0; i < instructions.length; i++) {
          if (instructions[i].programId.equals(programId)) {
              return instructions[i];
          }
      }
  
      return null;
    }
  
    private async _fetchMarketInfo(marketId: PublicKey) {
      const marketAccountInfo = await this.connection.getAccountInfo(marketId);
      if (!marketAccountInfo) {
          throw new Error('Failed to fetch market info for market id ' + marketId.toBase58());
      }
      
      return MARKET_STATE_LAYOUT_V3.decode(marketAccountInfo.data);
    }
    
    private async _formatAmmKeysById(id: string): Promise<ApiPoolInfoV4> {
      const account = await this.connection.getAccountInfo(new PublicKey(id))
      if (account === null) throw Error(' get id info error ')
      const info = LIQUIDITY_STATE_LAYOUT_V4.decode(account.data)
    
      const marketId = info.marketId
      const marketAccount = await this.connection.getAccountInfo(marketId)
      if (marketAccount === null) throw Error(' get market info error')
      const marketInfo = MARKET_STATE_LAYOUT_V3.decode(marketAccount.data)
    
      const lpMint = info.lpMint
      const lpMintAccount = await this.connection.getAccountInfo(lpMint)
      if (lpMintAccount === null) throw Error(' get lp mint info error')
      const lpMintInfo = SPL_MINT_LAYOUT.decode(lpMintAccount.data)
    
      return {
        id,
        baseMint: info.baseMint.toString(),
        quoteMint: info.quoteMint.toString(),
        lpMint: info.lpMint.toString(),
        baseDecimals: info.baseDecimal.toNumber(),
        quoteDecimals: info.quoteDecimal.toNumber(),
        lpDecimals: lpMintInfo.decimals,
        version: 4,
        programId: account.owner.toString(),
        authority: Liquidity.getAssociatedAuthority({ programId: account.owner }).publicKey.toString(),
        openOrders: info.openOrders.toString(),
        targetOrders: info.targetOrders.toString(),
        baseVault: info.baseVault.toString(),
        quoteVault: info.quoteVault.toString(),
        withdrawQueue: info.withdrawQueue.toString(),
        lpVault: info.lpVault.toString(),
        marketVersion: 3,
        marketProgramId: info.marketProgramId.toString(),
        marketId: info.marketId.toString(),
        marketAuthority: Market.getAssociatedAuthority({ programId: info.marketProgramId, marketId: info.marketId }).publicKey.toString(),
        marketBaseVault: marketInfo.baseVault.toString(),
        marketQuoteVault: marketInfo.quoteVault.toString(),
        marketBids: marketInfo.bids.toString(),
        marketAsks: marketInfo.asks.toString(),
        marketEventQueue: marketInfo.eventQueue.toString(),
        lookupTableAccount: PublicKey.default.toString()
      }
    }
}
require('dotenv').config();
import { LiquidityPoolKeys } from '@raydium-io/raydium-sdk';
import { MonitorFrame } from './MonitorFrame';
import { solscanTxUrl } from '../outPut/generateURL';
import { outputToken } from '../outPut/outputToken';
import { getTokenName } from '../Metadata/getTokenName';
import { TokenEvaluator } from '../Evaluator/TokenEvaluator';
import { ITokenData } from '../Interface/tokenData';
import { createEvaluator } from '../Evaluator/createEvaluator';
import { getTokenMutable } from '../Metadata/getTokenMutable';
import { getMint } from "@solana/spl-token";

export class TransactionMonitor extends MonitorFrame{
  public evaluator: TokenEvaluator | null = null;

  constructor(connectionUrl: string, programPublicKey: string) {
    super(connectionUrl, programPublicKey);
  }

  async startMonitoring() {
    try {
      console.log('Monitoring logs for program:', this.programAddress.toString());
      this.connection.onLogs(this.programAddress, this.onLogsCallback.bind(this), 'finalized'); // 'processed' | 'confirmed' | 'finalized' | 'recent' | 'single' | 'singleGossip' | 'root' | 'max'
    } catch (error) {
      console.error('Error in startMonitoring:', error);
      throw error;
    }
  }

  async onLogsCallback({ logs, err, signature }: { logs: string[] | undefined; err: any; signature: string }) {
    try {
      if (this.processedTransactions.has(signature)) return;
      
      if (err) return;
      
      this.processedTransactions.add(signature);
      if (logs && logs.some((log) => log.includes('initialize2'))) {
        console.log("New tx pool found: ", solscanTxUrl(signature));
        if (this.evaluator !== null) {
          await this.fetchRaydiumAccountsWithEvaluator(signature);
        }
        else{
          await this.fetchRaydiumAccounts(signature);
        }
      }
    } catch (error) {
      console.error('Error in onLogsCallback:', (error as Error).message);
      throw error;
    }
    
  }

  async fetchRaydiumAccounts(txId: string) {
    try {
      const tokenData = await this.getAllDataFromTx(txId)
      if (!tokenData) return

      // Send new message about new token pool
      await outputToken(tokenData);
    } catch (error) {
      console.error('Error in fetchRaydiumAccounts');
      return
    }
  }

  async fetchRaydiumAccountsWithEvaluator(txId: string) {
    try {
      const tokenData = await this.getAllDataFromTx(txId)
      if (!tokenData) return

      const evaluations = await this.evaluator?.evaluate(tokenData);
      if (evaluations) {
        // Send new message about new token pool
        await outputToken(tokenData);
      }
      else {
        console.log("Token doesn't fit the criteria\n")
      }
    } catch (error) {
      console.error('Error in fetchRaydiumAccountsWithEvaluator');
      return
    }
  }

  async getAllDataFromTx(txId: string) {
    try {
      const tx = await this.connection.getParsedTransaction(txId, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        console.log('Failed to fetch transaction with signature ' + txId);
        return
      }
    
      const poolKeysAll: LiquidityPoolKeys = await this.getPoolKeysAll(tx) as LiquidityPoolKeys;
      
      const tokenAName = getTokenName(poolKeysAll.baseMint);
      const tokenBName =  getTokenName(poolKeysAll.quoteMint);
      const isMutable = getTokenMutable(poolKeysAll.baseMint)
      const liquidity = this.decodeLiquidity(tx, poolKeysAll.baseMint);

      let mintAccount = await getMint(this.connection, poolKeysAll.baseMint);
      const totalSupply = Number(mintAccount.supply) / 10**mintAccount.decimals
      const freezeAuthority = (mintAccount.mintAuthority === null) ? true : false; 

      const tokenData: ITokenData = {
        txId,
        tokenAAccount: poolKeysAll.baseMint,
        tokenBAccount: poolKeysAll.quoteMint,
        tokenAName: await tokenAName,
        tokenBName: await tokenBName,
        liquidity: liquidity as number,
        totalSupply: totalSupply,
        freezeAuthority: freezeAuthority,
        mutable: await isMutable,
      };

      return tokenData
    } catch (error) {
      console.error('Error in getAllDataFromTx');
      return
    }
  }

  addEvaluator(Evaluator: TokenEvaluator) {
    this.evaluator = Evaluator
  }
}




async function test(){
  const RPC = process.env.RPC as string;
  const RAYDIUM_PUBLIC_KEY: string = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
  const Monitor = new TransactionMonitor(RPC, RAYDIUM_PUBLIC_KEY);
  const Evaluator: TokenEvaluator = createEvaluator()
  Monitor.addEvaluator(Evaluator);
  await Monitor.fetchRaydiumAccounts('638Ac1WnJ3cJvug1U9CuC3gv5F94chcacuqaZrgLqcxiqR2LbYEPUxyzrSbjzZHoDbQgi3bMrvzmKjaMBwiuS9WC') // pepe
  // await Monitor.getAllDataFromTx('5Kmnc4bwqjayz1QoiDcugAPBeK4Aq4hBsxxG1pcTMrDJ3GAkW4C13s7S6WZuQArYxWUgjmfSwcVxeBn1Mhxc7qNC') // pepe

}

// test()




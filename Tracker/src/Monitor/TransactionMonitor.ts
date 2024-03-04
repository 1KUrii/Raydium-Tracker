require('dotenv').config();
import { LiquidityPoolKeys } from '@raydium-io/raydium-sdk';
import { MonitorFrame } from './MonitorFrame';
import { generateSolscanUrl } from '../outPut/generateURL';
import { outputToken } from '../outPut/outputToken';
import { getTokenName } from '../Metadata/getTokenName';
import { newPairLiqudity } from '../Interface/msgInterface';

export class TransactionMonitor extends MonitorFrame{

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
        console.log("New tx pool found: ", generateSolscanUrl(signature));
        await this.fetchRaydiumAccounts(signature);
      }
    } catch (error) {
      console.error('Error in onLogsCallback:', (error as Error).message);
      throw error;
    }
    
  }

  async fetchRaydiumAccounts(txId: string) {
    try {
      const tx = await this.connection.getParsedTransaction(txId, {
        maxSupportedTransactionVersion: 0,
      });

      if (!tx) {
        throw new Error('Failed to fetch transaction with signature ' + txId);
      }
    

      const poolKeysAll: LiquidityPoolKeys = await this.getPoolKeysAll(tx) as LiquidityPoolKeys;
      
      
      const tokenAName = getTokenName(poolKeysAll.baseMint);
      const tokenBName =  getTokenName(poolKeysAll.quoteMint);
      const liquidity = this.decodeLiquidity(tx, poolKeysAll.baseMint);

      const msg: newPairLiqudity = {
        txId,
        tokenAAccount: poolKeysAll.baseMint,
        tokenBAccount: poolKeysAll.quoteMint,
        tokenAName: await tokenAName,
        tokenBName: await tokenBName,
        liquidity,
      };

      // Send new message about new token pool
      await outputToken(msg);

    } catch (error) {
      console.error('Error in fetchRaydiumAccounts');
      return
    }
  }

 
}




// async function test(){
//   const RPC = process.env.RPC as string;
//   const RAYDIUM_PUBLIC_KEY: string = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
//   const Monitor = new TransactionMonitor(RPC, RAYDIUM_PUBLIC_KEY);
//   await Monitor.fetchRaydiumAccounts('4XRa8kNR7uJNLzGegSpqGh6oHKsTVn8uSHXUuFGnhnNr8KxFrBfYMGYp4BHkmiX3FZXPKF6ttWBvyGHmJ2zNAtbL') // pepe
// }

// test()




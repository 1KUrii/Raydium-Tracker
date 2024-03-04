import { TransactionMonitor } from "./src/Monitor/TransactionMonitor";

async function main(){
    const RPC = process.env.RPC as string;
    const RAYDIUM_PUBLIC_KEY: string = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
    const Monitor = new TransactionMonitor(RPC, RAYDIUM_PUBLIC_KEY);
    await Monitor.startMonitoring()
}
  
main()
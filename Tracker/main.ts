import { TransactionMonitor } from "./src/Monitor/TransactionMonitor";
import { TokenEvaluator } from "./src/Evaluator/TokenEvaluator";
import { createEvaluator } from "./src/Evaluator/createEvaluator";

async function main(){
    const RPC = process.env.RPC as string;
    const RAYDIUM_PUBLIC_KEY: string = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
    const Monitor = new TransactionMonitor(RPC, RAYDIUM_PUBLIC_KEY);

    // Optional: if you want to receive notifications with special parameters 
    // Go to the src/Evaluator folder for more information
    // You can delete this field and the monitor will show all tokens
    // !!! There could be bugs !!! 
    const Evaluator: TokenEvaluator = createEvaluator()
    Monitor.addEvaluator(Evaluator);
    console.log(Monitor.evaluator)

    // Beginning of the search
    await Monitor.startMonitoring()
}
  
main()
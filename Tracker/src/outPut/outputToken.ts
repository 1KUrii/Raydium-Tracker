import { newPairLiqudity } from './Interface/msgInterface';
import { birdeyeUrl, solscanTokenUrl, solscanTxUrl } from './generateURL';


export async function outputToken(msg: newPairLiqudity) {
    console.log('New pair is added on Raydium');
    console.log(`Pair: ${msg.tokenAName}-${msg.tokenBName} ${solscanTxUrl(msg.txId)}`);
    console.log(`BaseToken: ${msg.tokenAName} ${solscanTokenUrl(msg.tokenAAccount)}`);
    console.log(`QuoteToken: ${msg.tokenBName} ${solscanTokenUrl(msg.tokenBAccount)}`);
    console.log(`Liquidity: ${(msg.liquidity != -1) ? (msg.liquidity) : ('--')} SOL`);
    console.log('📈 Trade on Birdeye:', birdeyeUrl(msg.tokenAAccount));
    console.log();
}

import { newPairLiqudity } from '../Interface/msgInterface';
import { generateBirdeyeUrl, generateSolscanUrl } from './generateURL';


export async function outputToken(msg: newPairLiqudity) {
    console.log('New pair is added on Raydium');
    console.log(`Pair: ${msg.tokenAName}-${msg.tokenBName}`);
    console.log(`SolanaScan: ${generateSolscanUrl(msg.txId)}`);
    console.log(`Explorer ${msg.tokenAName}: ${generateSolscanUrl(msg.tokenAAccount)}`);
    console.log(`Explorer ${msg.tokenBName}: ${generateSolscanUrl(msg.tokenBAccount)}`);
    console.log(`Liquidity: ${msg.liquidity} SOL`);
    console.log('📈 Trade on Birdeye:', generateBirdeyeUrl(msg.tokenAAccount));
    console.log();
}

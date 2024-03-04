import { PublicKey } from '@solana/web3.js';

//URL
const ADDRESS_SOLSCAN = 'https://solscan.io/tx/';

const EXPLORER_URL_BIRDEYE = 'https://birdeye.so/token/';
const CHAIN_BIRDEYE_SOL = '?chain=solana';

const URL_SOL_EXPLORER = 'https://explorer.solana.com/tx/'
const CHAIN_EXPLORER_DEV = '?cluster=devnet';
const CHAIN_EXPLORER_MAINNET = '?cluster=mainnet';

export function generateExplorerMainnetUrl(txId: PublicKey | string) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_MAINNET;
}


export function generateExplorerDEVUrl(txId: PublicKey | string) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_DEV;
}

export function generateSolscanUrl(txId: PublicKey | string) {
    return ADDRESS_SOLSCAN + txId;
}
    
export function generateBirdeyeUrl(tokenAAccount: PublicKey | string) {
    return EXPLORER_URL_BIRDEYE + tokenAAccount + CHAIN_BIRDEYE_SOL;
}


import { PublicKey } from '@solana/web3.js';

//URL
const ADDRESS_SOLSCAN_TX = 'https://solscan.io/tx/';
const ADDRESS_SOLSCAN_TOKEN = 'https://solscan.io/token/';

const EXPLORER_URL_BIRDEYE = 'https://birdeye.so/token/';
const CHAIN_BIRDEYE_SOL = '?chain=solana';

const URL_SOL_EXPLORER = 'https://explorer.solana.com/tx/'
const CHAIN_EXPLORER_DEV = '?cluster=devnet';
const CHAIN_EXPLORER_MAINNET = '?cluster=mainnet';


export function generateExplorerMainnetUrl(txId: PublicKey | string) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_MAINNET;
}

export function explorerDEVUrl(txId: PublicKey | string) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_DEV;
}

export function solscanTxUrl(txId: PublicKey | string) {
    return ADDRESS_SOLSCAN_TX + txId;
}

export function solscanTokenUrl(txId: PublicKey | string) {
    return ADDRESS_SOLSCAN_TOKEN + txId;
}
    
export function birdeyeUrl(tokenAAccount: PublicKey | string) {
    return EXPLORER_URL_BIRDEYE + tokenAAccount + CHAIN_BIRDEYE_SOL;
}


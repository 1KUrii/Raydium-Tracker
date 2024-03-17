"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.birdeyeUrl = exports.solscanTokenUrl = exports.solscanTxUrl = exports.explorerDEVUrl = exports.generateExplorerMainnetUrl = void 0;
//URL
var ADDRESS_SOLSCAN_TX = 'https://solscan.io/tx/';
var ADDRESS_SOLSCAN_TOKEN = 'https://solscan.io/token/';
var EXPLORER_URL_BIRDEYE = 'https://birdeye.so/token/';
var CHAIN_BIRDEYE_SOL = '?chain=solana';
var URL_SOL_EXPLORER = 'https://explorer.solana.com/tx/';
var CHAIN_EXPLORER_DEV = '?cluster=devnet';
var CHAIN_EXPLORER_MAINNET = '?cluster=mainnet';
function generateExplorerMainnetUrl(txId) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_MAINNET;
}
exports.generateExplorerMainnetUrl = generateExplorerMainnetUrl;
function explorerDEVUrl(txId) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_DEV;
}
exports.explorerDEVUrl = explorerDEVUrl;
function solscanTxUrl(txId) {
    return ADDRESS_SOLSCAN_TX + txId;
}
exports.solscanTxUrl = solscanTxUrl;
function solscanTokenUrl(txId) {
    return ADDRESS_SOLSCAN_TOKEN + txId;
}
exports.solscanTokenUrl = solscanTokenUrl;
function birdeyeUrl(tokenAAccount) {
    return EXPLORER_URL_BIRDEYE + tokenAAccount + CHAIN_BIRDEYE_SOL;
}
exports.birdeyeUrl = birdeyeUrl;
//# sourceMappingURL=generateURL.js.map
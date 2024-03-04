"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBirdeyeUrl = exports.generateSolscanUrl = exports.generateExplorerDEVUrl = exports.generateExplorerMainnetUrl = void 0;
//URL
var ADDRESS_SOLSCAN = 'https://solscan.io/tx/';
var EXPLORER_URL_BIRDEYE = 'https://birdeye.so/token/';
var CHAIN_BIRDEYE_SOL = '?chain=solana';
var URL_SOL_EXPLORER = 'https://explorer.solana.com/tx/';
var CHAIN_EXPLORER_DEV = '?cluster=devnet';
var CHAIN_EXPLORER_MAINNET = '?cluster=mainnet';
function generateExplorerMainnetUrl(txId) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_MAINNET;
}
exports.generateExplorerMainnetUrl = generateExplorerMainnetUrl;
function generateExplorerDEVUrl(txId) {
    return URL_SOL_EXPLORER + txId + CHAIN_EXPLORER_DEV;
}
exports.generateExplorerDEVUrl = generateExplorerDEVUrl;
function generateSolscanUrl(txId) {
    return ADDRESS_SOLSCAN + txId;
}
exports.generateSolscanUrl = generateSolscanUrl;
function generateBirdeyeUrl(tokenAAccount) {
    return EXPLORER_URL_BIRDEYE + tokenAAccount + CHAIN_BIRDEYE_SOL;
}
exports.generateBirdeyeUrl = generateBirdeyeUrl;
//# sourceMappingURL=generateURL.js.map
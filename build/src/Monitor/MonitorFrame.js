"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitorFrame = void 0;
require('dotenv').config();
var web3_js_1 = require("@solana/web3.js");
var bs58_1 = __importDefault(require("bs58"));
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
var spl_token_1 = require("@solana/spl-token");
var assert_1 = __importDefault(require("assert"));
var MonitorFrame = /** @class */ (function () {
    function MonitorFrame(connectionUrl, programPublicKey) {
        this.SERUM_OPENBOOK_PROGRAM_ID = 'srmqPvymJeFKQ4zGQed1GFppgkRHL9kaELCbyksJtPX';
        this.SOL_MINT = new web3_js_1.PublicKey('So11111111111111111111111111111111111111112');
        this.SOL_DECIMALS = 9;
        try {
            this.connection = new web3_js_1.Connection(connectionUrl, { commitment: 'confirmed' });
            this.programAddress = new web3_js_1.PublicKey(programPublicKey);
            this.processedTransactions = new Set();
        }
        catch (error) {
            console.error('Error in constructor:', error);
            throw error;
        }
    }
    // public methods --------------------------------------------------
    MonitorFrame.prototype.getPoolKeysAll = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var poolInfo, marketInfo, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, this._getAssociatedPoolKeys(tx)];
                    case 1:
                        poolInfo = _a.sent();
                        return [4 /*yield*/, this._fetchMarketInfo(poolInfo.marketId)];
                    case 2:
                        marketInfo = _a.sent();
                        return [2 /*return*/, {
                                id: poolInfo.id,
                                baseMint: poolInfo.baseMint,
                                quoteMint: poolInfo.quoteMint,
                                lpMint: poolInfo.lpMint,
                                baseDecimals: poolInfo.baseDecimals,
                                quoteDecimals: poolInfo.quoteDecimals,
                                lpDecimals: poolInfo.lpDecimals,
                                version: 4,
                                programId: poolInfo.programId,
                                authority: poolInfo.authority,
                                openOrders: poolInfo.openOrders,
                                targetOrders: poolInfo.targetOrders,
                                baseVault: poolInfo.baseVault,
                                quoteVault: poolInfo.quoteVault,
                                withdrawQueue: poolInfo.withdrawQueue,
                                lpVault: poolInfo.lpVault,
                                marketVersion: 3,
                                marketProgramId: poolInfo.marketProgramId,
                                marketId: poolInfo.marketId,
                                marketAuthority: raydium_sdk_1.Market.getAssociatedAuthority({ programId: poolInfo.marketProgramId, marketId: poolInfo.marketId }).publicKey,
                                marketBaseVault: marketInfo.baseVault,
                                marketQuoteVault: marketInfo.quoteVault,
                                marketBids: marketInfo.bids,
                                marketAsks: marketInfo.asks,
                                marketEventQueue: marketInfo.eventQueue,
                            }];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error in getPoolKeysAll:', error_1);
                        throw error_1;
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    MonitorFrame.prototype.decodeLiquidity = function (tx, tokenA) {
        try {
            var firstTokenSol = (tokenA.equals(this.SOL_MINT)) ? true : false;
            var instructionsLiquidity = tx === null || tx === void 0 ? void 0 : tx.transaction.message.instructions[4];
            var liquidityData = instructionsLiquidity.data;
            var decodedBytes = Buffer.from(bs58_1.default.decode(liquidityData)).reverse();
            var pcTokensAmount = void 0;
            if (firstTokenSol) {
                var firstSubstring = decodedBytes.slice(0, 8).toString('hex');
                pcTokensAmount = parseInt(firstSubstring, 16);
            }
            else {
                var secondSubstring = decodedBytes.slice(8, 16).toString('hex');
                pcTokensAmount = parseInt(secondSubstring, 16);
            }
            return pcTokensAmount / Math.pow(10, 9);
        }
        catch (error) {
            console.error('Error decoding bs58 data:', error);
            return '--';
        }
    };
    MonitorFrame.prototype.getAllKeysTwo = function (tokenMint) {
        return __awaiter(this, void 0, void 0, function () {
            var targetPoolInfo, poolKeys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this._formatAmmKeysById(tokenMint)];
                    case 1:
                        targetPoolInfo = _a.sent();
                        (0, assert_1.default)(targetPoolInfo, 'cannot find the target pool');
                        poolKeys = (0, raydium_sdk_1.jsonInfo2PoolKeys)(targetPoolInfo);
                        return [2 /*return*/, poolKeys];
                }
            });
        });
    };
    // private methods -------------------------------------------------
    MonitorFrame.prototype._getAssociatedPoolKeys = function (tx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __awaiter(this, void 0, void 0, function () {
            var initInstruction, baseMint_1, baseVault, quoteMint, quoteVault, lpMint, baseAndQuoteSwapped, lpMintInitInstruction, lpMintInstruction, baseTransferInstruction, quoteTransferInstruction, lpDecimals, lpInitializationLogEntryInfo, basePreBalance, baseDecimals;
            return __generator(this, function (_p) {
                try {
                    initInstruction = this._findInstructionByProgramId(tx.transaction.message.instructions, new web3_js_1.PublicKey(this.programAddress));
                    if (!initInstruction) {
                        throw new Error('Failed to find lp init instruction in lp init tx');
                    }
                    baseMint_1 = initInstruction.accounts[8];
                    baseVault = initInstruction.accounts[10];
                    quoteMint = initInstruction.accounts[9];
                    quoteVault = initInstruction.accounts[11];
                    lpMint = initInstruction.accounts[7];
                    baseAndQuoteSwapped = baseMint_1.toBase58() === this.SOL_MINT.toBase58();
                    lpMintInitInstruction = this._findInitializeMintInInnerInstructionsByMintAddress((_b = (_a = tx.meta) === null || _a === void 0 ? void 0 : _a.innerInstructions) !== null && _b !== void 0 ? _b : [], lpMint);
                    if (!lpMintInitInstruction) {
                        throw new Error('Failed to find lp mint init instruction in lp init tx');
                    }
                    lpMintInstruction = this._findMintToInInnerInstructionsByMintAddress((_d = (_c = tx.meta) === null || _c === void 0 ? void 0 : _c.innerInstructions) !== null && _d !== void 0 ? _d : [], lpMint);
                    if (!lpMintInstruction) {
                        throw new Error('Failed to find lp mint to instruction in lp init tx');
                    }
                    baseTransferInstruction = this._findTransferInstructionInInnerInstructionsByDestination((_f = (_e = tx.meta) === null || _e === void 0 ? void 0 : _e.innerInstructions) !== null && _f !== void 0 ? _f : [], baseVault, spl_token_1.TOKEN_PROGRAM_ID);
                    if (!baseTransferInstruction) {
                        throw new Error('Failed to find base transfer instruction in lp init tx');
                    }
                    quoteTransferInstruction = this._findTransferInstructionInInnerInstructionsByDestination((_h = (_g = tx.meta) === null || _g === void 0 ? void 0 : _g.innerInstructions) !== null && _h !== void 0 ? _h : [], quoteVault, spl_token_1.TOKEN_PROGRAM_ID);
                    if (!quoteTransferInstruction) {
                        throw new Error('Failed to find quote transfer instruction in lp init tx');
                    }
                    lpDecimals = lpMintInitInstruction.parsed.info.decimals;
                    lpInitializationLogEntryInfo = this._extractLPInitializationLogEntryInfoFromLogEntry((_l = this._findLogEntry('init_pc_amount', (_k = (_j = tx.meta) === null || _j === void 0 ? void 0 : _j.logMessages) !== null && _k !== void 0 ? _k : [])) !== null && _l !== void 0 ? _l : '');
                    basePreBalance = ((_o = (_m = tx.meta) === null || _m === void 0 ? void 0 : _m.preTokenBalances) !== null && _o !== void 0 ? _o : []).find(function (balance) { return balance.mint === baseMint_1.toBase58(); });
                    if (!basePreBalance) {
                        throw new Error('Failed to find base tokens preTokenBalance entry to parse the base tokens decimals');
                    }
                    baseDecimals = basePreBalance.uiTokenAmount.decimals;
                    return [2 /*return*/, {
                            id: initInstruction.accounts[4],
                            baseMint: baseMint_1,
                            quoteMint: quoteMint,
                            lpMint: lpMint,
                            baseDecimals: baseAndQuoteSwapped ? this.SOL_DECIMALS : baseDecimals,
                            quoteDecimals: baseAndQuoteSwapped ? baseDecimals : this.SOL_DECIMALS,
                            lpDecimals: lpDecimals,
                            version: 4,
                            programId: new web3_js_1.PublicKey(this.programAddress),
                            authority: initInstruction.accounts[5],
                            openOrders: initInstruction.accounts[6],
                            targetOrders: initInstruction.accounts[12],
                            baseVault: baseVault,
                            quoteVault: quoteVault,
                            withdrawQueue: new web3_js_1.PublicKey("11111111111111111111111111111111"),
                            lpVault: new web3_js_1.PublicKey(lpMintInstruction.parsed.info.account),
                            marketVersion: 3,
                            marketProgramId: initInstruction.accounts[15],
                            marketId: initInstruction.accounts[16],
                            baseReserve: parseInt(baseTransferInstruction.parsed.info.amount),
                            quoteReserve: parseInt(quoteTransferInstruction.parsed.info.amount),
                            lpReserve: parseInt(lpMintInstruction.parsed.info.amount),
                            openTime: lpInitializationLogEntryInfo.open_time,
                        }];
                }
                catch (error) {
                    console.error('Error in getAssociatedPoolKeys:', error);
                    throw error;
                }
                return [2 /*return*/];
            });
        });
    };
    MonitorFrame.prototype._findLogEntry = function (needle, logEntries) {
        for (var i = 0; i < logEntries.length; ++i) {
            if (logEntries[i].includes(needle)) {
                return logEntries[i];
            }
        }
        return null;
    };
    MonitorFrame.prototype._extractLPInitializationLogEntryInfoFromLogEntry = function (lpLogEntry) {
        var lpInitializationLogEntryInfoStart = lpLogEntry.indexOf('{');
        return JSON.parse(this._fixRelaxedJsonInLpLogEntry(lpLogEntry.substring(lpInitializationLogEntryInfoStart)));
    };
    MonitorFrame.prototype._fixRelaxedJsonInLpLogEntry = function (relaxedJson) {
        return relaxedJson.replace(/([{,])\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:/g, "$1\"$2\":");
    };
    MonitorFrame.prototype._findTransferInstructionInInnerInstructionsByDestination = function (innerInstructions, destinationAccount, programId) {
        for (var i = 0; i < innerInstructions.length; i++) {
            for (var y = 0; y < innerInstructions[i].instructions.length; y++) {
                var instruction = innerInstructions[i].instructions[y];
                if (!instruction.parsed) {
                    continue;
                }
                ;
                if (instruction.parsed.type === 'transfer' && instruction.parsed.info.destination === destinationAccount.toBase58() && (!programId || instruction.programId.equals(programId))) {
                    return instruction;
                }
            }
        }
        return null;
    };
    MonitorFrame.prototype._findMintToInInnerInstructionsByMintAddress = function (innerInstructions, mintAddress) {
        for (var i = 0; i < innerInstructions.length; i++) {
            for (var y = 0; y < innerInstructions[i].instructions.length; y++) {
                var instruction = innerInstructions[i].instructions[y];
                if (!instruction.parsed) {
                    continue;
                }
                ;
                if (instruction.parsed.type === 'mintTo' && instruction.parsed.info.mint === mintAddress.toBase58()) {
                    return instruction;
                }
            }
        }
        return null;
    };
    MonitorFrame.prototype._findInitializeMintInInnerInstructionsByMintAddress = function (innerInstructions, mintAddress) {
        for (var i = 0; i < innerInstructions.length; i++) {
            for (var y = 0; y < innerInstructions[i].instructions.length; y++) {
                var instruction = innerInstructions[i].instructions[y];
                if (!instruction.parsed) {
                    continue;
                }
                ;
                if (instruction.parsed.type === 'initializeMint' && instruction.parsed.info.mint === mintAddress.toBase58()) {
                    return instruction;
                }
            }
        }
        return null;
    };
    MonitorFrame.prototype._findInstructionByProgramId = function (instructions, programId) {
        for (var i = 0; i < instructions.length; i++) {
            if (instructions[i].programId.equals(programId)) {
                return instructions[i];
            }
        }
        return null;
    };
    MonitorFrame.prototype._fetchMarketInfo = function (marketId) {
        return __awaiter(this, void 0, void 0, function () {
            var marketAccountInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.getAccountInfo(marketId)];
                    case 1:
                        marketAccountInfo = _a.sent();
                        if (!marketAccountInfo) {
                            throw new Error('Failed to fetch market info for market id ' + marketId.toBase58());
                        }
                        return [2 /*return*/, raydium_sdk_1.MARKET_STATE_LAYOUT_V3.decode(marketAccountInfo.data)];
                }
            });
        });
    };
    MonitorFrame.prototype._formatAmmKeysById = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var account, info, marketId, marketAccount, marketInfo, lpMint, lpMintAccount, lpMintInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.getAccountInfo(new web3_js_1.PublicKey(id))];
                    case 1:
                        account = _a.sent();
                        if (account === null)
                            throw Error(' get id info error ');
                        info = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4.decode(account.data);
                        marketId = info.marketId;
                        return [4 /*yield*/, this.connection.getAccountInfo(marketId)];
                    case 2:
                        marketAccount = _a.sent();
                        if (marketAccount === null)
                            throw Error(' get market info error');
                        marketInfo = raydium_sdk_1.MARKET_STATE_LAYOUT_V3.decode(marketAccount.data);
                        lpMint = info.lpMint;
                        return [4 /*yield*/, this.connection.getAccountInfo(lpMint)];
                    case 3:
                        lpMintAccount = _a.sent();
                        if (lpMintAccount === null)
                            throw Error(' get lp mint info error');
                        lpMintInfo = raydium_sdk_1.SPL_MINT_LAYOUT.decode(lpMintAccount.data);
                        return [2 /*return*/, {
                                id: id,
                                baseMint: info.baseMint.toString(),
                                quoteMint: info.quoteMint.toString(),
                                lpMint: info.lpMint.toString(),
                                baseDecimals: info.baseDecimal.toNumber(),
                                quoteDecimals: info.quoteDecimal.toNumber(),
                                lpDecimals: lpMintInfo.decimals,
                                version: 4,
                                programId: account.owner.toString(),
                                authority: raydium_sdk_1.Liquidity.getAssociatedAuthority({ programId: account.owner }).publicKey.toString(),
                                openOrders: info.openOrders.toString(),
                                targetOrders: info.targetOrders.toString(),
                                baseVault: info.baseVault.toString(),
                                quoteVault: info.quoteVault.toString(),
                                withdrawQueue: info.withdrawQueue.toString(),
                                lpVault: info.lpVault.toString(),
                                marketVersion: 3,
                                marketProgramId: info.marketProgramId.toString(),
                                marketId: info.marketId.toString(),
                                marketAuthority: raydium_sdk_1.Market.getAssociatedAuthority({ programId: info.marketProgramId, marketId: info.marketId }).publicKey.toString(),
                                marketBaseVault: marketInfo.baseVault.toString(),
                                marketQuoteVault: marketInfo.quoteVault.toString(),
                                marketBids: marketInfo.bids.toString(),
                                marketAsks: marketInfo.asks.toString(),
                                marketEventQueue: marketInfo.eventQueue.toString(),
                                lookupTableAccount: web3_js_1.PublicKey.default.toString()
                            }];
                }
            });
        });
    };
    return MonitorFrame;
}());
exports.MonitorFrame = MonitorFrame;
//# sourceMappingURL=MonitorFrame.js.map
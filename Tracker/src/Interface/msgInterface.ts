import { PublicKey } from "@solana/web3.js";

export interface newPairLiqudity {
    txId: string,
    tokenAAccount: PublicKey | string,
    tokenBAccount: PublicKey | string,
    tokenAName: PublicKey | string,
    tokenBName: PublicKey | string,
    liquidity: number | string
}
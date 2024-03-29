// The list is not complete and may change over time.
import { PublicKey } from "@solana/web3.js"

export interface ITokenData {
    txId:               string
    tokenAAccount:      PublicKey | string
    tokenBAccount:      PublicKey | string
    tokenAName:         PublicKey | string
    tokenBName:         PublicKey | string
    liquidity:          number | null
    totalSupply:        number | null
    // Mint function enables contract owner to issue more tokens and cause the coin price to plummet
    freezeAuthority:    string | boolean | null
    // The token information such as name, logo, website address can be changed by the owner.
    mutable:            string | boolean | null
}

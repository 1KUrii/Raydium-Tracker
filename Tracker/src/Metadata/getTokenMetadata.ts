import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import * as mplTokenMetadata from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';
import * as mplUmi from '@metaplex-foundation/umi';

// create Umi connection
const RPC = process.env.RPC as string;
const umi = createUmi(RPC).use(mplTokenMetadata.mplTokenMetadata());

export async function getTokenMetadata(tokenAccount: PublicKey) {
  try {
    // Convert the PublicKey to string
    const tokenAccountString = tokenAccount.toString();

    // Create a new PublicKey instance from the string using @metaplex-foundation/umi-public-keys
    const tokenAccountUmi = mplUmi.publicKey(tokenAccountString);

    const asset = await mplTokenMetadata.fetchDigitalAsset(umi, tokenAccountUmi);

    if (!asset) {
      console.log(`Token account asset not found.`);
      return 'Unknown Token';
    }

    return asset;

  } catch (error: any) {
    console.error('Error in getTokenMetadata:', (error as Error).message || 'Unknown Error');
    return 'Unknown Token';
  }
}
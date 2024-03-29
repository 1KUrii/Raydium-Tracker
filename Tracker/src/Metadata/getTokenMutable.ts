import { PublicKey } from '@solana/web3.js';
import * as mplTokenMetadata from '@metaplex-foundation/mpl-token-metadata';
import { getTokenMetadata } from './getTokenMetadata';
;

export async function getTokenMutable(tokenAccount: PublicKey) {
  try {
    const asset: mplTokenMetadata.DigitalAsset | "Unknown Token" = await getTokenMetadata(tokenAccount);

    if (typeof asset === 'string') {
      // Handle the case where 'Unknown Token' is returned
      return asset;
    }
    // Now you can safely access the properties of DigitalAsset
    const isMutable: boolean = asset.metadata.isMutable

    return isMutable;
  } catch (error: any) {
    console.error('Error in getTokenName:', (error as Error).message || 'Unknown Error');
    return 'Unknown Token';
  }
}

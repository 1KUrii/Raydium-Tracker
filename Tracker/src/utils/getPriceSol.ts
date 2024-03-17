import fetch from 'cross-fetch';

// https://price.jup.ag/v4/price?ids=SOL
// Example data:
/*
{
    data: {
      SOL: {
        id: 'So11111111111111111111111111111111111111112',
        mintSymbol: 'SOL',
        vsToken: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        vsTokenSymbol: 'USDC',
        price: 194.742563068
      }
    },
    timeTaken: 0.00022651399990536447
  }
*/


export async function getPriceSol(){
    const quoteResponse = await (await fetch('https://price.jup.ag/v4/price?ids=SOL')).json();
    return quoteResponse.data.SOL.price as number;
}

// async function getPrice(){
//     console.log(await getPriceSol())
// }

// getPrice()
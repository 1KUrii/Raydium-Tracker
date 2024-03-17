import { getPriceSol } from '../../utils/getPriceSol';
import { IEvaluationStrategy } from '../Interface/evaluationStrategy';
import { ITokenData } from '../Interface/tokenData';

export class liquidityUsdStrategy implements IEvaluationStrategy {
    private minLiquidity: number = 100; // In Usd 100 $
    async evaluate(tokenData: ITokenData): Promise<boolean> {
        if (tokenData.liquidity!== null && tokenData.liquidity * await getPriceSol() > this.minLiquidity) {
            return true;
        }
        return false;
    }
}

import { IEvaluationStrategy } from "../Interface/evaluationStrategy";
import { ITokenData } from "../Interface/tokenData";

export class liquiditySolStrategy implements IEvaluationStrategy {
    minSolLiquidity = 0.01; // In Sol 0.01 Sol

    async evaluate(tokenData: ITokenData): Promise<boolean> {
        if (tokenData.liquidity!== null && tokenData.liquidity > this.minSolLiquidity) {
            return true;
        }
        return false;
    }
}
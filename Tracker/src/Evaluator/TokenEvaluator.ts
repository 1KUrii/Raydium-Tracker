import { IEvaluationStrategy } from "./Interface/evaluationStrategy";
import { ITokenData } from "./Interface/tokenData";

export class TokenEvaluator {
    private Strategies: IEvaluationStrategy[];
  
    constructor() {
      this.Strategies = [];
    }
  
    addStrategy(strategy: IEvaluationStrategy) {
      this.Strategies.push(strategy);
    }
  
    async evaluate(tokenData: ITokenData): Promise<boolean> {
      for (const strategy of this.Strategies) {
        if (await strategy.evaluate(tokenData) === false) {
          return false
        }
      }
      return true
    }
}
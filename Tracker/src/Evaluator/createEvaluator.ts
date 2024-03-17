import { liquiditySolStrategy } from "./Strategies/liquiditySol";
import { liquidityUsdStrategy } from "./Strategies/liquidityUsd";
import { TokenEvaluator } from "./TokenEvaluator";

/**
 * Creates a new TokenEvaluator instance.
 */

export function createEvaluator(): TokenEvaluator {
    const evaluator = new TokenEvaluator();
  
    // Add strategies to the evaluator
    evaluator.addStrategy(new liquiditySolStrategy());
    evaluator.addStrategy(new liquidityUsdStrategy());
  
    return evaluator;
  }

import { IEvaluationStrategy } from "../../Interface/evaluationStrategy";
import { ITokenData } from "../../Interface/tokenData";

// Inherit from the interface IEvaluationStrategy And be sure to implement the method evaluate
export class ExampleStrategy implements IEvaluationStrategy {

    /*
        You can create your own fields and methods inside this class,
        but passing it to the evaluator will run only the evaluate
    */

    async evaluate(tokenData: ITokenData): Promise<boolean> {

        if (tokenData.liquidity !== null && tokenData) {
            return true;
        }

        return false;
    }
}

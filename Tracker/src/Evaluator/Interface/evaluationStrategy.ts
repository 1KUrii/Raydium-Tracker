import { ITokenData } from "./tokenData";

export interface IEvaluationStrategy {
    evaluate(tokenData: ITokenData): Promise<boolean>;
}
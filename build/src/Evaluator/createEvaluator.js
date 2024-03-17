"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEvaluator = void 0;
var liquiditySol_1 = require("./Strategies/liquiditySol");
var liquidityUsd_1 = require("./Strategies/liquidityUsd");
var TokenEvaluator_1 = require("./TokenEvaluator");
/**
 * Creates a new TokenEvaluator instance.
 */
function createEvaluator() {
    var evaluator = new TokenEvaluator_1.TokenEvaluator();
    // Add strategies to the evaluator
    evaluator.addStrategy(new liquiditySol_1.liquiditySolStrategy());
    evaluator.addStrategy(new liquidityUsd_1.liquidityUsdStrategy());
    return evaluator;
}
exports.createEvaluator = createEvaluator;
//# sourceMappingURL=createEvaluator.js.map
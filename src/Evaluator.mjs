import { spnr } from './lib/spnr.mjs';
import tokenise from './tokenise.mjs';
import lex from './lex.mjs';
import parse from './parse.mjs';
import { EvaluationContext } from './EvaluationContext.mjs';

export class Evaluator {
    constructor() {
        this.context = new EvaluationContext();
    }

    evaluate(expression) {
        var tree = compile(expression);
        this.evaluateCompiledExpression(tree);
    }

    compile(expression) {
        var tokens = tokenise(expression);
        var lexemes = lex(tokens);
        var tree = parse(lexemes);
        return tree;
    }

    evaluateCompiledExpression(compiledExpression) {
        tree.evaluate(compiledExpression);
    }
}
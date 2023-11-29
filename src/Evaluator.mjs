import { spnr } from './lib/spnr.mjs';
import tokenise from './tokenise.mjs';
import lex from './lex.mjs';
import parse from './parse.mjs';
import { EvaluationContext } from './EvaluationContext.mjs';

export class Evaluator {
    constructor() {
        this.context = new EvaluationContext();
    }

    evaluate(expression, context=this.context) {
        var tree = compile(expression);
        this.evaluateCompiledExpression(tree, context);
    }

    compile(expression) {
        var tokens = tokenise(expression);
        var lexemes = lex(tokens);
        var tree = parse(lexemes);
        return tree;
    }

    evaluateCompiledExpression(compiledExpression, context=this.context) {
        tree.evaluate(compiledExpression, context);
    }
}
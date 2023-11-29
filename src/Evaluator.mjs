import { spnr } from './lib/spnr.mjs';
import tokenise from './tokenise.mjs';
import lex from './lex.mjs';
import parse from './parse.mjs';
import { EvaluationContext } from './EvaluationContext.mjs';
import { MathSyntaxError } from './Errors.mjs';

export class Evaluator {
    constructor() {
        this.context = new EvaluationContext();
    }

    evaluate(expression, debugMode=false, context=this.context) {
        var tree = this.compile(expression, debugMode);
        return this.evaluateCompiledExpression(tree, context);
    }

    compile(expression, debugMode=false) {
        try {
            var tokens = tokenise(expression);
            if (debugMode) console.log('Tokens:', tokens);
            var lexemes = lex(tokens);
            if (debugMode) console.log('Lexemes:', lexemes);
            var tree = parse(lexemes);
            if (debugMode) console.log('AST:', tree);
            return tree;
        }
        catch (e) {
            if (debugMode) console.log('Error during compilation: ', e);
            throw new MathSyntaxError();
        }
    }

    evaluateCompiledExpression(compiledExpression, context=this.context) {
        return compiledExpression.evaluate(context);
    }
}
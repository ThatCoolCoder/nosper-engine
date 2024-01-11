import { spnr } from './lib/spnr.mjs';
import tokenise from './tokenise.mjs';
import lex from './lex.mjs';
import parse from './parse.mjs';
import { EvaluationContext } from './EvaluationContext.mjs';
import { EvaluationError, MathSyntaxError } from './Errors.mjs';

export class Evaluator {
    constructor(context=new EvaluationContext()) {
        this.context = context;
    }

    evaluate(expression, debugMode=false, context=this.context) {
        var tree = this.compile(expression, debugMode);
        return this.evaluateCompiledExpression(tree, context, debugMode);
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
            if (e instanceof EvaluationError) throw e;
            else throw new MathSyntaxError();
        }
    }

    evaluateCompiledExpression(compiledExpression, context=this.context, debugMode=false) {
        try
        {
            return compiledExpression.evaluate(context);
        }
        catch (e) {
            if (debugMode) console.log('Error during evaluation: ', e);
            if (e instanceof EvaluationError) throw e;
            else throw new MathSyntaxError();
        }
    }

    applyLoadable(loadable) {
        this.context.applyLoadable(loadable, this);
    }

    removeLoadable(loadable) {
        this.context.removeLoadable(loadable);
    }
}
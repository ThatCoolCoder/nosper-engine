import { spnr } from './lib/spnr.mjs'
import { Token, TokenSubType, TokenType, OperatorPrecedence, ParsedFunctionCallToken } from './Token.mjs';
import { EvaluationContext } from './EvaluationContext.mjs';
import { Tokeniser } from './Tokeniser.mjs';
import { ValueNode, UnaryOperatorNode, BinaryOperatorNode, FunctionCallNode } from './SyntaxTreeNodes.mjs';
import * as Errors from './Errors.mjs';
import { start } from 'repl';

export class Evaluator {
    // Entry class. Create one and use it to evaluate math equations

    // Effects of debugMode:
    // provides ugly error info instead of just a MathSyntaxError

    constructor(debugMode=false) {
        this.debugMode = debugMode;

        this.context = new EvaluationContext();
        this.tokeniser = new Tokeniser();

        this.expressionSplitter = ';';
    }

    /**
     * Evaluate multiple expressions separated by this.expressionSplitter 
     */
    evaluate(expressions) {
        expressions = expressions.split(this.expressionSplitter).map(e => e.trim()).filter(e => e.length > 0);
        var results = expressions.map(e => this.evaluateSingleExpression(e));
        var finalAnswer = results[results.length - 1];
        this.context.previousAnswer = finalAnswer;
        return finalAnswer;
    }

    /**
     * Evaluate a single expression
     */
    evaluateSingleExpression(expression) {
        var compiledExpression = this.compileSingleExpression(expression);
        return this.evaluateCompiledExpression(compiledExpression);
    }

    /**
     * Compile an expression for later use. May throw an EvaulationError
     */
    compileSingleExpression(expression) {
        var tokens = this.tokeniser.tokeniseExpression(expression);
        if (this.debugMode) {
            console.log('tokens:');
            console.log(tokens);
        }
        try {
            var syntaxTree = this.buildSyntaxTree(tokens);
            if (this.debugMode) {
                console.log('syntax tree:');
                console.log(syntaxTree);
            }
            return syntaxTree;
        }
        catch (e) {
            if (this.debugMode) throw e;
            if (e instanceof Errors.EvaluationError) throw e;
            else throw new Errors.MathSyntaxError();
        }
    }

    /**
     * Evaluate a pre-compiled expression.
     */
    evaluateCompiledExpression(compiledExpression) {
        try {
            return compiledExpression.evaluate(this.context);
        }
        catch (e) {
            if (this.debugMode) throw e;
            if (e instanceof Errors.EvaluationError) throw e;
            else throw new Errors.MathSyntaxError();
        }
    }

    /**
     * Apply a loadable
     */
    load(loadable) {
        loadable.apply(this.context);
    }

    /**
     * Remove a loadable
     */
    unload(loadable) {
        loadable.remove(this.context);
    }

    buildSyntaxTree(tokens) {
        // If there's a function call, convert that that before anything else
        if (this.containsUnparsedFunctionCall(tokens)) {
            var functionIndex = tokens.findIndex(t => t.type == TokenType.FUNCTION_CALL);
            var closeBracketIndex = this.findMatchingBracket(tokens, functionIndex + 1);
            var args = this.splitWhere(tokens.slice(functionIndex + 2, closeBracketIndex), t => t.subType == TokenSubType.ARGUMENT_SEPARATOR);

            var parsedArgs = args.map(arg => this.buildSyntaxTree(arg));

            var parsedFunctionCall = new ParsedFunctionCallToken(TokenType.FUNCTION_CALL, TokenSubType.PARSED_FUNCTION_CALL, tokens[functionIndex].value, parsedArgs);
            var left = tokens.slice(0, functionIndex);
            var right = tokens.slice(closeBracketIndex + 1);
            return this.buildSyntaxTree(left.concat(parsedFunctionCall, right));
        }

        // If there is only 1 token left then turn it into a leaf node
        if (tokens.length == 1) {
            if (tokens[0].type == TokenType.VALUE) return new ValueNode(tokens[0].value, tokens[0].subType);
            else if (tokens[0].subType == TokenSubType.PARSED_FUNCTION_CALL) return new FunctionCallNode(tokens[0].value, tokens[0].args);
        }

        // If there are brackets, eliminate the brackets.
        // To get around brackets existing, what we do is apply extra precedence to the operators inside brackets,
        // proportional to the depth of the brackets.
        // Then we can remove the brackets and nobody will even notice
        if (this.containsBrackets(tokens)) {
            // Get start/end of most bracketed section
            var [startIdx, endIdx, nestingLevel] = this.getHighestNestingInfo(tokens);
            var bracketedTokens = tokens.slice(startIdx + 1, endIdx);
            var precedenceIncrement = spnr.obj.keys(OperatorPrecedence).length;
            for (var token of bracketedTokens) {
                // Only set the precedence on tokens which haven't had it set - 
                // What this achieves it to only set tokens which are at this nesting level and not higher,
                // since existing ones will have had it set earlier.
                if (token.extraPrecedence == 0) {
                    token.extraPrecedence = nestingLevel * precedenceIncrement;
                }
            }
            var left = tokens.slice(0, startIdx);
            var right = tokens.slice(endIdx + 1);
            return this.buildSyntaxTree(left.concat(bracketedTokens).concat(right));
        }
        // When there aren't brackets, find lowest precedence operator, extract it into a node, repeat for lhs and rhs
        else {
            // return;
            var index = this.findLowestPrecedenceOperator(tokens);
            var left = tokens.slice(0, index);
            var right = tokens.slice(index + 1);
            if (tokens[index].type == TokenType.BINARY_OPERATOR)
                return new BinaryOperatorNode(this.buildSyntaxTree(left), this.buildSyntaxTree(right), tokens[index].subType);
            else if (tokens[index].type == TokenType.UNARY_OPERATOR)
                return new UnaryOperatorNode(this.buildSyntaxTree(right), tokens[index].subType);
        }
    }

    containsBrackets(tokens) {
        return tokens.some(t => [TokenSubType.L_PAREN, TokenSubType.R_PAREN].includes(t.subType));
    }

    containsUnparsedFunctionCall(tokens) {
        return tokens.some(t => t.type == TokenType.FUNCTION_CALL && t.subType == TokenSubType.UNPARSED_FUNCTION_CALL);
    }

    splitWhere(data, predicate) {
        var result = [];
        var crntChunk = [];
        for (var value of data) {
            if (predicate(value)) {
                result.push(crntChunk);
                crntChunk = [];
            }
            else crntChunk.push(value);
        }
        if (crntChunk.length > 0) result.push(crntChunk);
        return result;
    }

    getHighestNestingInfo(tokens) {
        // Get info about what and where is the highest nesting of brackets in the expression.
        // Indices 
        var crntNestingLevel = 0;
        var highestNestingLevel = 0;
        var highestNestStart = -1;
        var highestNestEnd = -1;
        var index = 0;
        for (var token of tokens) {
            if (token.subType == TokenSubType.L_PAREN) {
                crntNestingLevel++;
                if (crntNestingLevel >= highestNestingLevel) {
                    highestNestingLevel = crntNestingLevel;
                    highestNestStart = index;
                }
            }
            if (token.subType == TokenSubType.R_PAREN) {
                if (crntNestingLevel == highestNestingLevel) {
                    highestNestEnd = index;
                }
                crntNestingLevel --;
            }
            index ++;
        }
        return [highestNestStart, highestNestEnd, highestNestingLevel];
    }

    findMatchingBracket(tokens, openBracketIndex) {
        var startingNestingLevel = 0;
        var crntNestingLevel = 0;
        for (var index = openBracketIndex; index < tokens.length; index ++) {
            var token = tokens[index];
            if (token.subType == TokenSubType.L_PAREN) crntNestingLevel ++;
            else if (token.subType == TokenSubType.R_PAREN) {
                crntNestingLevel --;
                if (crntNestingLevel == startingNestingLevel) return index;
            }
        }

        return null;
    }

    findLowestPrecedenceOperator(tokens) {
        var lowestPrecedence = Infinity;
        var lowestPrecedenceIndex = -1;
        var index = 0;
        for (var token of tokens) {
            if (token.subType in OperatorPrecedence) {
                // use <= here because later tokens with otherwise identical precedence have less precedence
                if (OperatorPrecedence[token.subType] + token.extraPrecedence <= lowestPrecedence) {
                    lowestPrecedence = OperatorPrecedence[token.subType] + token.extraPrecedence;
                    lowestPrecedenceIndex = index;
                }
            }
            index++;
        }
        return lowestPrecedenceIndex;
    }
}
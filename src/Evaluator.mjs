import { spnr } from './lib/spnr.mjs'
import { TokenSubType, TokenType, OperatorPrecedence, ParsedFunctionCallToken } from "./Token.mjs";
import { EvaluationContext } from "./EvaluationContext.mjs";
import { Tokeniser } from "./Tokeniser.mjs";
import { ValueNode, UnaryOperatorNode, BinaryOperatorNode, FunctionCallNode } from "./SyntaxTreeNodes.mjs";

export class Evaluator {
    // Entry class. Create one and use it to evaluate math equations

    static MathSyntaxError = class extends Error {
        constructor() {
            super('Invalid syntax in expression');
            this.name = 'MathSyntaxError';
        }
    }

    constructor() {
        this.context = new EvaluationContext();
        this.tokeniser = new Tokeniser();

        this.expressionSplitter = ';';
    }

    /**
     * Evaluate multiple expressions separated by this.expressionSplitter 
     */
    evaluate(expressions) {
        expressions = expressions.split(this.expressionSplitter);
        var results = expressions.map(e => this.evaluateSingleExpression(e));
        return results[results.length - 1];
    }

    /**
     * Evaluate a single expression
     */
    evaluateSingleExpression(expression) {
        var tokens = this.tokeniser.tokeniseExpression(expression);
        var syntaxTree = this.buildSyntaxTree(tokens);
        return syntaxTree.evaluate(this.context);
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

        // If there is only 1 token left then 
        if (tokens.length == 1) {
            if (tokens[0].type == TokenType.VALUE) return new ValueNode(tokens[0].value);
            else if (tokens[0].subType == TokenSubType.PARSED_FUNCTION_CALL) return new FunctionCallNode(tokens[0].value, tokens[0].args);
        }

        // If there are brackets, eliminate the brackets.
        // To get around brackets existing, what we do is apply extra precedence to the operators inside brackets,
        // proportional to the depth of the brackets.
        // Then we can remove the brackets and nobody will even notice
        if (this.containsBrackets(tokens)) {
            // Get start/end of most bracketed section
            var [startIdx, endIdx, nestingLevel] = this.getNestingInfo(tokens);
            var bracketedTokens = tokens.slice(startIdx + 1, endIdx - 1);
            var precedenceIncrement = spnr.obj.keys(OperatorPrecedence).length;
            for (var token of bracketedTokens) {
                token.extraPrecedence = nestingLevel * precedenceIncrement;
            }
            var left = tokens.slice(0, startIdx);
            var right = tokens.slice(endIdx);
            return this.buildSyntaxTree(left.concat(bracketedTokens).concat(right));
        }
        // When there aren't brackets, find lowest precedence operator, extract it into a node, repeat for lhs and rhs
        else {
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

    getNestingInfo(tokens) {
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
                    highestNestEnd = index + 1;
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
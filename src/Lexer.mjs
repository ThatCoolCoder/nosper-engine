import { spnr } from './lib/spnr.mjs'
import { Token, TokenType, TokenSubType } from "./Token.mjs";

export class Lexer {
    // Class to tokenise string (not thread-safe)

    tokeniseExpression(expression) {
        console.log('--', expression);
        this.charIdx = 0;
        this.crntChar = expression[0]
        this.expression = expression;
        var tokens = [];
        
        while (this.charIdx < expression.length) {
            console.log(this.readNumber());
            break;
        }

        this.postProcessTokens(tokens);

        return tokens;
    }

    postProcessTokens(tokens) {
        this.convertToNegations(tokens);
        tokens = this.insertImplicitMultiplicationSigns(tokens);
    }

    next(amount = 1) {
        this.charIdx += amount;
        this.crntChar = this.expression[this.charIdx];
    }

    peekNext(amount = 1) {
        return this.expression[this.charIdx + amount];
    }

    previous(amount = 1) {
        this.charIdx -= amount;
        this.crntChar = this.expression[this.charIdx];
    }

    peekPrevious(amount = 1) {
        return this.expression[this.charIdx + amount];
    }

    readNumber() {
        var mainNumberVal = '';
        var exponentVal = '';
        var exponentIsNegative = false;
        var periodCount = 0;
        var isReadingExponent = false;
        while (true) {
            if (! isReadingExponent) {
                // Don't allow multiple
                if (this.crntChar == '.') periodCount ++;
                if (periodCount >= 2)
                {
                    this.next();
                    break;
                }
                
                // Check if main number part is done
                var nextIsNumber = spnr.str.digits.includes(this.peekNext(2));
                var nextIsNegativeNumber = this.peekNext(2) == '-' && spnr.str.digits.includes(this.peekNext(2));
                if (this.crntChar == 'e' && (nextIsNumber || nextIsNegativeNumber))
                {
                    exponentIsNegative = nextIsNegativeNumber;
                    isReadingExponent = true;
                    this.next(exponentIsNegative ? 3 : 2); // skip over the e (and optional -) completely
                    continue;
                }

                if (this.crntChar == '.' || spnr.str.digits.includes(this.crntChar))
                {
                    console.log(this.crntChar);
                    mainNumberVal += this.crntChar;
                    this.next();
                }
                else {
                    this.next();
                    break;
                }

            } else {
                if (spnr.str.digits.includes(this.crntChar)) {
                    exponentVal += this.crntChar;
                    this.next();
                }
                else {
                    this.next();
                    break;
                }
            }
            this.next();
        }
        console.log(mainNumberVal, '^', exponentVal);
        if (mainNumberVal == '') mainNumberVal = '1'; // prevent exponent-only numbers equalling 0
        return Number(mainNumberVal) * 10 ** (Number(exponentVal) * exponentIsNegative ? -1 : 1);
    }

    readIdentifier() {
        // Read a function or variable name
        var value = '';
        while (spnr.str.digits.includes(this.crntChar) || spnr.str.alphabet.includes(this.crntChar) || this.crntChar == '_') {
            value += this.crntChar;
            this.next();
        }
        return value;
    }

    nextCharsEqualTo(targetValue) {
        return this.expression.slice(this.charIdx, this.charIdx + targetValue.length) == targetValue;
    }

    nextCharsEqualToAny(targetValues) {
        for (var value of targetValues) {
            if (this.nextCharsEqualTo(value)) return value;
        }
        return null;
    }

    convertToNegations(tokens) {
        // Convert a subtraction operation into a negation operation in some cases
        var previous = null;
        tokens.forEach((token, idx) => {
            if (token.subType == TokenSubType.SUBTRACT) {
                var previousTokenImpliesNegation = true;

                // (if this is first token, it must be a negation)
                if (idx >= 1) {
                    previousTokenImpliesNegation = (
                        previous.type == TokenType.UNARY_OPERATOR ||
                        previous.type == TokenType.BINARY_OPERATOR ||
                        previous.subType == TokenSubType.L_PAREN ||
                        previous.subType == TokenSubType.ARGUMENT_SEPARATOR);
                }

                if (previousTokenImpliesNegation)
                {
                    token.type = TokenType.UNARY_OPERATOR;
                    token.subType = TokenSubType.NEGATE;
                }
            }
            previous = token;
        })
    }

    insertImplicitMultiplicationSigns(tokens) {
        var newTokens = [];

        for (var i = 0; i < tokens.length - 1; i ++)
        {
            var currentToken = tokens[i];
            var nextToken = tokens[i + 1];

            var currentTokenOk = currentToken.type == TokenType.VALUE ||
                currentToken.subType == TokenSubType.R_PAREN;
            var nextTokenOk = nextToken.type == TokenType.VALUE ||
                nextToken.subType == TokenSubType.L_PAREN || 
                nextToken.subType == TokenSubType.UNPARSED_FUNCTION_CALL ||
                nextToken.type == TokenType.UNARY_OPERATOR;

            newTokens.push(currentToken);
            if (currentTokenOk && nextTokenOk)
            {
                newTokens.push(new Token(TokenType.BINARY_OPERATOR, TokenSubType.MULTIPLY, '*'));
            }
        }
        newTokens.push(tokens[tokens.length - 1]); // add last token because we missed it in the loop
        
        return newTokens;
    }
}

// test number reading

new Lexer().tokeniseExpression('50.2')
// new Lexer().tokeniseExpression('.2')
// new Lexer().tokeniseExpression('50.')
// new Lexer().tokeniseExpression('e3')
// new Lexer().tokeniseExpression('5e3')
// new Lexer().tokeniseExpression('e-3')
// new Lexer().tokeniseExpression('5e-3')
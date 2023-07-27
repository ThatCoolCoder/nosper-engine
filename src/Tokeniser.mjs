import { spnr } from './lib/spnr.mjs'
import { Token, TokenType, TokenSubType } from "./Token.mjs";

export class Tokeniser {
    // Class to tokenise string

    // A purposefully incomplete table designed to make some lookups easier
    StringToTokenSubType = {
        // Binary operator
        '+': TokenSubType.ADD,
        '-': TokenSubType.SUBTRACT,
        'x': TokenSubType.MULTIPLY,
        '*': TokenSubType.MULTIPLY,
        '/': TokenSubType.DIVIDE,
        '%': TokenSubType.MODULO,
        '**': TokenSubType.EXPONENTIATE,
        '^': TokenSubType.EXPONENTIATE,
        '?': TokenSubType.IF,
        // Binary operator: assign
        '=': TokenSubType.ASSIGN,
        '=>': TokenSubType.FUNCTION_ASSIGN,

        // Unary operator: trigonometry
        'sin': TokenSubType.SINE,
        'asin': TokenSubType.ARC_SINE,
        'cos': TokenSubType.COSINE,
        'acos': TokenSubType.ARC_COSINE,
        'tan': TokenSubType.TANGENT,
        'atan': TokenSubType.ARC_TANGENT,
        'log': TokenSubType.LOGARITHM,
        'ln': TokenSubType.NATURAL_LOGARITHM,
        'round': TokenSubType.ROUND,
        'floor': TokenSubType.FLOOR,
        'ceil': TokenSubType.CEILING,

        // Unary operator: not trigonometry
        'sqrt': TokenSubType.SQUARE_ROOT,
        'q': TokenSubType.SQUARE_ROOT,
        'cbrt': TokenSubType.CUBE_ROOT,
        'c': TokenSubType.CUBE_ROOT,

        // Value
        // <none>

        // Paren
        '(': TokenSubType.L_PAREN,
        ')': TokenSubType.R_PAREN
    }

    tokeniseExpression(expression) {
        this.charIdx = 0;
        this.crntChar = expression[0]
        this.expression = expression;
        var tokens = [];

        while (this.charIdx < expression.length) {
            // Basic operators & symbols
            if (this.nextCharsEqualToAny(['+', '-', '/', '%', '^', '?', '=>', '=', 'x']) != null) {
                var text = this.nextCharsEqualToAny(['+', '-', '/', '%', '^', '?', '=>', '=', 'x']);
                tokens.push(new Token(TokenType.BINARY_OPERATOR,
                    this.StringToTokenSubType[text], text));
                this.next(text.length);
            }
            else if (this.crntChar == '*') {
                if (this.nextCharsEqualTo('**')) {
                    tokens.push(new Token(TokenType.BINARY_OPERATOR, TokenSubType.EXPONENTIATE, '**'));
                    this.next(2);
                }
                else {
                    tokens.push(new Token(TokenType.BINARY_OPERATOR, TokenSubType.MULTIPLY, '*'));
                    this.next();
                }
            }
            else if ('()'.includes(this.crntChar)) {
                tokens.push(new Token(TokenType.PAREN, this.StringToTokenSubType[this.crntChar], this.crntChar));
                this.next();
            }
            else if (this.crntChar == ',') {
                tokens.push(new Token(TokenType.SEPARATOR, TokenSubType.ARGUMENT_SEPARATOR, this.crntChar));
                this.next();
            }
            else if (this.nextCharsEqualToAny(['sin', 'asin', 'cos', 'acos', 'tan', 'atan', 'round', 'floor', 'ceil', 'sqrt', 'q', 'cbrt', 'c', 'abs', 'log', 'ln', ]) != null) {
                var text = this.nextCharsEqualToAny(['sin', 'asin', 'cos', 'acos', 'tan', 'atan', 'round', 'floor', 'ceil', 'sqrt', 'q', 'cbrt', 'c', 'abs', 'log', 'ln']);
                tokens.push(new Token(TokenType.UNARY_OPERATOR, this.StringToTokenSubType[text], text));
                this.next(text.length);
            }
            // Values
            else if (spnr.str.digits.includes(this.crntChar) || this.crntChar == '.') {
                tokens.push(new Token(TokenType.VALUE, TokenSubType.LITERAL, Number(this.readNumber())));
            }
            else if (this.crntChar.toLowerCase() == 'e' && (
                spnr.str.digits.includes(this.peekNext()) || 
                this.peekNext() == '-' && spnr.str.digits.includes(this.peekNext(2))
                )) {
                // Try to read number like  E6  (10^6)
                this.next();
                if (this.crntChar == '-') {
                    var isNegative = true;
                    this.next();
                }
                else isNegative = false;

                var exponent = Number(this.readNumber());
                if (isNegative) exponent *= -1;
                var value = 10 ** exponent;
                tokens.push(new Token(TokenType.VALUE, TokenSubType.LITERAL, value));
            }
            else if (this.crntChar == '$') {
                this.next();
                tokens.push(new Token(TokenType.VALUE, TokenSubType.VARIABLE, this.readEntityNameString()));
            }
            else if (this.nextCharsEqualTo('ans'))
            {
                this.next('ans'.length);
                tokens.push(new Token(TokenType.VALUE, TokenSubType.PREVIOUS_ANSWER, 'ans'));
            }
            // Functions
            else if (this.crntChar == '&') {
                this.next();
                tokens.push(new Token(TokenType.FUNCTION_CALL, TokenSubType.UNPARSED_FUNCTION_CALL, this.readEntityNameString()));
            }
            else {
                this.next();
            }
        }

        this.convertToNegations(tokens);

        tokens = this.insertImplicitMultiplicationSigns(tokens);

        return tokens;
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
        var numberVal = '';
        var periodCount = 0;
        while ((spnr.str.digits.includes(this.crntChar) || this.crntChar == '.') && periodCount < 2) {
            numberVal += this.crntChar;
            this.next();
        }
        return numberVal;
    }

    readString() {
        var stringVal = '';
        while (spnr.str.alphabet.includes(this.crntChar)) {
            stringVal += this.crntChar;
            this.next();
        }
        return stringVal;
    }

    readEntityNameString() {
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
                var previousTokenValid = true;

                if (idx >= 1) {
                    previousTokenValid = (
                        previous.type == TokenType.UNARY_OPERATOR ||
                        previous.type == TokenType.BINARY_OPERATOR ||
                        previous.subType == TokenSubType.L_PAREN ||
                        previous.subType == TokenSubType.ARGUMENT_SEPARATOR);
                }

                if (previousTokenValid)
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
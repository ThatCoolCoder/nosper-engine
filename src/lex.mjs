import { spnr } from './lib/spnr.mjs'
import { Lexeme, LexemeType, LexemeSubType } from './Lexeme.mjs';
import { TokenType } from './Token.mjs';
import ParseContext from './ParseContext.mjs';

const symbolicOperatorLookup = {
    '+' : [LexemeType.BINARY_OPERATOR, LexemeSubType.ADD],
    '-' : [LexemeType.BINARY_OPERATOR, LexemeSubType.SUBTRACT],
    '*' : [LexemeType.BINARY_OPERATOR, LexemeSubType.MULTIPLY],
    '/' : [LexemeType.BINARY_OPERATOR, LexemeSubType.DIVIDE],
    '//' : [LexemeType.BINARY_OPERATOR, LexemeSubType.DIVIDE_LOW_PRECEDENCE],
    '%' : [LexemeType.BINARY_OPERATOR, LexemeSubType.MODULO],

    '**' : [LexemeType.BINARY_OPERATOR, LexemeSubType.EXPONENTIATE],
    '^' : [LexemeType.BINARY_OPERATOR, LexemeSubType.EXPONENTIATE],

    '!' : [LexemeType.POSTFIX_OPERATOR, LexemeSubType.FACTORIAL],
};

const textOperatorLookup = {
    'ans' : [LexemeType.VALUE, LexemeSubType.PREVIOUS_ANSWER],

    'sin' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.SINE],
    'asin' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ARC_SINE],
    'csc' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.COSECANT],

    'cos' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.COSINE],
    'acos' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ARC_COSINE],
    'sec' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.SECANT],

    'tan' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.TANGENT],
    'atan' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ARC_TANGENT],
    'cot' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.COTANGENT],

    'q' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.SQUARE_ROOT],
    'sqrt' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.SQUARE_ROOT],
    'cbrt' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.CUBE_ROOT],
    'abs' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ABSOLUTE_VALUE],
    'log' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.LOGARITHM],
    'ln' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.NATURAL_LOGARITHM],
    'round' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ROUND],
    'floor' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.FLOOR],
    'ceil' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.CEILING],
};

const parenLookup = {
    '(': [LexemeSubType.L_PAREN, LexemeSubType.L_PAREN],
    ')': [LexemeSubType.R_PAREN, LexemeSubType.R_PAREN],
    '{': [LexemeSubType.L_PAREN, LexemeSubType.L_CURLY_PAREN],
    '}': [LexemeSubType.R_PAREN, LexemeSubType.R_CURLY_PAREN],
}

export default function lex(tokens) {
    var lexemes = [];

    var ctx = new ParseContext(tokens);

    while (!ctx.finished) {
        lexemes = lexemes.concat(lexExpression());
        ctx.next();
    }

    return postProcess(lexemes);

    

    function lexExpression() {
        var result = [];
        while (!ctx.finished) {
            if (ctx.crntItem.type == TokenType.NUMBER) {
                result.push(new Lexeme(LexemeType.VALUE, LexemeSubType.NUMBER, ctx.crntItem.value));
                ctx.next();
            }
            else if (ctx.crntItem.type == TokenType.SYMBOLIC_OPERATOR) {
                result = result.concat(lexSymbolicOperators(ctx.crntItem.value));
                ctx.next();
            }
            else if (ctx.crntItem.type == TokenType.TEXT) {
                result = result.concat(lexText(ctx.crntItem.value));
                ctx.next();
            }
            else if (ctx.crntItem.type == TokenType.PAREN) {
                var [type, subType] = parenLookup[ctx.crntItem.value];
                result.push(new Lexeme(type, subType, ctx.crntItem.value));
                ctx.next();
            }
            else {
                throw new Error(`Unknown token type: "${ctx.crntItem.type}"`)
            }
        }
        return result;
    }

    function lexSymbolicOperators(operators) {
        var ctx = new ParseContext(operators);
        var result = [];

        while (!ctx.finished) {
            var found = greedyFindFirst(ctx.remaining, spnr.obj.keys(symbolicOperatorLookup));
            if (found == null) throw new Error(`Unexpected symbols: "${ctx.remaining}"`);
            var [type, subType] = symbolicOperatorLookup[found];
            result.push(new Lexeme(type, subType, found))
            ctx.next(found.length);
        }

        return result;
    }

    function lexText(text) {
        var ctx = new ParseContext(text);
        var result = [];

        while (!ctx.finished) {
            var found = greedyFindFirst(ctx.remaining, spnr.obj.keys(textOperatorLookup));
            if (found == null) {
                // Person has not typed an operator - read variable
                var varName = ctx.crntItem;
                ctx.next();
                if (ctx.crntItem == '_' || varName == '_') {
                    // If is multi-letter, take all the text
                    varName += ctx.remaining;
                    result.push(new Lexeme(LexemeType.VALUE, LexemeSubType.VARIABLE, varName));
                    break;
                }
                else {
                    // Else take just this letter
                    result.push(new Lexeme(LexemeType.VALUE, LexemeSubType.VARIABLE, varName));
                }
            }
            else {
                // If we found text operator, read it
                var [type, subType] = textOperatorLookup[found];
                result.push(new Lexeme(type, subType, found))
                ctx.next(found.length);
            }
        }

        return result;
    }

    function greedyFindFirst(string, searchVals) {
        var sorted = searchVals.concat([]);
        sorted.sort((a, b) => a.length - b.length);
        sorted.reverse();

        for (var item of sorted) {
            if (string.slice(0, item.length) == item) return item;
        }

        return null;
    }
}

function postProcess(lexemes) {
    var result = lexemes;
    result = convertToNegations(lexemes);
    result = insertImplicitMultiplicationSigns(lexemes);
    return result;
}

function convertToNegations(lexemes) {
    // Convert a subtraction operation into a negation operation in some cases
    var previous = null;
    return lexemes.map((lexeme, idx) => {
        if (lexeme.subType == LexemeSubType.SUBTRACT) {
            var previousTokenValid = true;

            if (idx >= 1) {
                previousTokenValid = (
                    previous.type == LexemeType.PREFIX_OPERATOR ||
                    previous.type == LexemeType.BINARY_OPERATOR ||
                    previous.subType == LexemeSubType.L_PAREN)//; ||
                    // previous.subType == LexemeSubType.ARGUMENT_SEPARATOR);
            }

            if (previousTokenValid)
            {
                lexeme.type = LexemeType.PREFIX_OPERATOR;
                lexeme.subType = LexemeSubType.NEGATE;
            }
        }
        previous = lexeme;
    });
}

function insertImplicitMultiplicationSigns(lexemes) {
    var result = [];

    for (var i = 0; i < lexemes.length - 1; i ++)
    {
        var crntLexeme = lexemes[i];
        var nextLexeme = lexemes[i + 1];

        var crntLexemeOk = crntLexeme.type == LexemeType.VALUE ||
            crntLexeme.subType == LexemeSubType.R_PAREN ||
            crntLexeme.type == LexemeSubType.POSTFIX_OPERATOR;

        var nextLexemeOk = nextLexeme.type == LexemeType.VALUE ||
            nextLexeme.subType == LexemeSubType.L_PAREN || 
            // nextLexeme.subType == LexemeSubType.UNPARSED_FUNCTION_CALL ||
            nextLexeme.type == LexemeType.PREFIX_OPERATOR;

        result.push(crntLexeme);
        if (crntLexemeOk && nextLexemeOk)
        {
            result.push(new Lexeme(LexemeType.BINARY_OPERATOR, LexemeSubType.MULTIPLY, '*'));
        }
    }
    result.push(lexemes[lexemes.length - 1]); // add final lexeme because we missed it in the loop
    
    return result;
}
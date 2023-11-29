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
    'sin' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.SINE],
    'asin' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ARC_SINE],
    'csc' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.COSECANT],

    'cos' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.COSINE],
    'acos' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ARC_COSINE],
    'sec' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.SECANT],

    'tan' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.TANGENT],
    'atan' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.ARC_TANGENT],
    'cot' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.COTANGENT],

    'log' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.LOGARITHM],
    'ln' : [LexemeType.PREFIX_OPERATOR, LexemeSubType.NATURAL_LOGARITHM],
};

export default function lex(tokens) {
    var lexemes = [];

    var ctx = new ParseContext(tokens);

    while (!ctx.finished) {
        lexemes = lexemes.concat(lexExpression());
        ctx.next();
    }

    return lexemes;

    

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
            var data = symbolicOperatorLookup[found];
            result.push(new Lexeme(data[0], data[1], found))
            ctx.next(found.length);
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
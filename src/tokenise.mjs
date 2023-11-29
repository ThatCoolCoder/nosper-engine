import { spnr } from './lib/spnr.mjs'
import ParseContext from './ParseContext.mjs';
import { Token, TokenType } from "./Token.mjs";

const numberChars = [...spnr.str.digits, '.'];
const symbolicOperatorChars = '+-*/^%!=<>,'.split('');
const parenChars = '(){}'.split('');
const whitespaceChars = ' '.split('');

const textStartChars = [...spnr.str.alphabet, '_'];
const textRestChars = [...spnr.str.alphabet, ...spnr.str.digits, '_'];

export default function tokenise(expression) {
    // yes perhaps it is weird to write this as a function instead of a class,
    // but I think this is the easiest way to make this thread-safe while preserving state between methods

    var tokens = [];
    var ctx = new ParseContext(expression);
    
    while (!ctx.finished) {
        if (numberChars.includes(ctx.crntItem)) {
            tokens.push(new Token(TokenType.NUMBER, readNumber()));
        }
        else if (symbolicOperatorChars.includes(ctx.crntItem)) {
            tokens.push(new Token(TokenType.SYMBOLIC_OPERATOR, readSymbolicOperators()))
        }
        else if (whitespaceChars.includes(ctx.crntItem)) {
            skipWhitespace();
        }
        else if (parenChars.includes(ctx.crntItem)) {
            tokens.push(new Token(TokenType.PAREN, ctx.crntItem));
            ctx.next();
        }
        else if (textStartChars.includes(ctx.crntItem)) {
            tokens.push(new Token(TokenType.TEXT, readText()));
        }
        else {
            throw new Error(`Unexpected character while parsing: "${ctx.crntItem}"`);
        }
    }

    return tokens;



    function readNumber() {
        // Yes this is long. But it is hopefully fairly readable and it is quite capable.

        var mainNumberVal = '';
        var exponentVal = '';
        var exponentIsNegative = false;
        var periodCount = 0;
        var isReadingExponent = false;
        while (!ctx.finished) {
            if (! isReadingExponent) {
                // Don't allow multiple
                if (ctx.crntItem == '.') periodCount ++;
                if (periodCount >= 2)
                {
                    ctx.next();
                    break;
                }
                
                // Check if main number part is done
                var nextIsNumber = spnr.str.digits.includes(ctx.peekNext(1));
                var nextIsNegativeNumber = ctx.peekNext(1) == '-' && spnr.str.digits.includes(ctx.peekNext(2));
                if (ctx.crntItem == 'e' && (nextIsNumber || nextIsNegativeNumber))
                {
                    exponentIsNegative = nextIsNegativeNumber;
                    isReadingExponent = true;
                    ctx.next(exponentIsNegative ? 2 : 1); // skip over the e (and optional -) completely
                    continue;
                }

                if (ctx.crntItem == '.' || spnr.str.digits.includes(ctx.crntItem))
                {
                    mainNumberVal += ctx.crntItem;
                    ctx.next();
                }
                else {
                    break;
                }

            } else { // (if is reading exponent)
                if (spnr.str.digits.includes(ctx.crntItem)) {
                    exponentVal += ctx.crntItem;
                    ctx.next();
                }
                else {
                    break;
                }
            }
        }
        if (mainNumberVal.trim() == '') mainNumberVal = '1'; // prevent exponent-only numbers equalling 0

        return Number(mainNumberVal) * 10 ** (Number(exponentVal) * (exponentIsNegative ? -1 : 1));
    }

    function readSymbolicOperators() {
        var result = '';
        while (!ctx.finished) {
            result += ctx.crntItem;
            ctx.next();
            if (!symbolicOperatorChars.includes(ctx.crntItem)) break;
        }
        return result;
    }

    function skipWhitespace() {
        while (whitespaceChars.includes(ctx.crntItem) && !ctx.finished) ctx.next();
    }

    function readText() {
        var value = '';

        var crntCharSet = textStartChars;
        while (crntCharSet.includes(ctx.crntItem) && !ctx.finished) {
            value += ctx.crntItem;
            if (ctx.crntItem == '_') {
                crntCharSet = textRestChars;
            }
            ctx.next();
        }

        return value;
    }
}
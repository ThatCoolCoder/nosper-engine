import { spnr } from './lib/spnr.mjs'
import { Token, TokenType } from "./Token.mjs";

const numberChars = [...spnr.str.digits, '.'];
const symbolicOperatorChars = '+-*/^%!'.split('');
const parenChars = '(){}'.split('');
const whitespaceChars = ' '.split('');

const textStartChars = [...spnr.str.alphabet, '_'];
const textRestChars = [...spnr.str.alphabet, ...spnr.str.digits, '_'];

export default function tokenise(expression) {
    // yes perhaps it is weird to write this as a function instead of a class,
    // but I think this is the easiest way to make this thread-safe while preserving state between methods

    var charIdx = 0;
    var crntChar = expression[0]
    var expression = expression;
    var tokens = [];
    
    while (charIdx < expression.length) {
        if (numberChars.includes(crntChar)) {
            tokens.push(new Token(TokenType.NUMBER, readNumber()));
        }
        else if (symbolicOperatorChars.includes(crntChar)) {
            tokens.push(new Token(TokenType.SYMBOLIC_OPERATOR, readSymbolicOperators()))
        }
        else if (whitespaceChars.includes(crntChar)) {
            skipWhitespace();
        }
        else if (parenChars.includes(crntChar)) {
            tokens.push(new Token(TokenType.PAREN, crntChar));
            next();
        }
        else if (textStartChars.includes(crntChar)) {
            tokens.push(new Token(TokenType.TEXT, readText()));
        }
        else {
            throw new Error(`Unexpected character while parsing: "${crntChar}"`);
        }
    }

    return tokens;



    function next(amount = 1) {
        charIdx += amount;
        crntChar = expression[charIdx];
    }

    function peekNext(amount = 1) {
        return expression[charIdx + amount];
    }

    function previous(amount = 1) {
        charIdx -= amount;
        crntChar = expression[charIdx];
    }

    function peekPrevious(amount = 1) {
        return expression[charIdx + amount];
    }

    function readNumber() {
        // Yes this is long. But it is hopefully fairly readable and it is quite capable.

        var mainNumberVal = '';
        var exponentVal = '';
        var exponentIsNegative = false;
        var periodCount = 0;
        var isReadingExponent = false;
        while (charIdx < expression.length) {
            if (! isReadingExponent) {
                // Don't allow multiple
                if (crntChar == '.') periodCount ++;
                if (periodCount >= 2)
                {
                    next();
                    break;
                }
                
                // Check if main number part is done
                var nextIsNumber = spnr.str.digits.includes(peekNext(1));
                var nextIsNegativeNumber = peekNext(1) == '-' && spnr.str.digits.includes(peekNext(2));
                if (crntChar == 'e' && (nextIsNumber || nextIsNegativeNumber))
                {
                    exponentIsNegative = nextIsNegativeNumber;
                    isReadingExponent = true;
                    next(exponentIsNegative ? 2 : 1); // skip over the e (and optional -) completely
                    continue;
                }

                if (crntChar == '.' || spnr.str.digits.includes(crntChar))
                {
                    mainNumberVal += crntChar;
                    next();
                }
                else {
                    next();
                    break;
                }

            } else {
                if (spnr.str.digits.includes(crntChar)) {
                    exponentVal += crntChar;
                    next();
                }
                else {
                    next();
                    break;
                }
            }
        }
        if (mainNumberVal.trim() == '') mainNumberVal = '1'; // prevent exponent-only numbers equalling 0

        return Number(mainNumberVal) * 10 ** (Number(exponentVal) * (exponentIsNegative ? -1 : 1));
    }

    function readSymbolicOperators() {
        var result = '';
        while (charIdx < expression.length) {
            result += crntChar;
            next();
            if (!symbolicOperatorChars.includes(crntChar)) break;
        }
        return result;
    }

    function skipWhitespace() {
        while (whitespaceChars.includes(crntChar) && charIdx < expression.length) next();
    }

    function readText() {
        var value = '';

        var crntCharSet = textStartChars;
        while (crntCharSet.includes(crntChar) && charIdx < expression.length) {
            value += crntChar;
            if (crntChar == '_') {
                crntCharSet = textRestChars;
            }
            next();
        }

        return value;
    }

    function nextCharsEqualTo(targetValue) {
        return expression.slice(charIdx, charIdx + targetValue.length) == targetValue;
    }

    function nextCharsEqualToAny(targetValues) {
        for (var value of targetValues) {
            if (nextCharsEqualTo(value)) return value;
        }
        return null;
    }
}
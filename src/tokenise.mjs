import { spnr } from './lib/spnr.mjs'
import { Token, TokenType, TokenSubType } from "./Token.mjs";

export default function tokenise(expression) {
    // yes perhaps it is weird to write this as a function instead of a class,
    // but I think this is the easiest way to make this thread-safe while preserving state between methods

    var charIdx = 0;
    var crntChar = expression[0]
    var expression = expression;
    var tokens = [];
    
    while (charIdx < expression.length) {
        console.log(readNumber());
        break;
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

    function readIdentifier() {
        // Read a function or variable name
        var value = '';
        while (spnr.str.digits.includes(crntChar) || spnr.str.alphabet.includes(crntChar) || crntChar == '_') {
            value += crntChar;
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
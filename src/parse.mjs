import { spnr } from './lib/spnr.mjs';
import { Lexeme, LexemeType, LexemeSubType } from './Lexeme.mjs';
import { BinaryOperatorNode, SyntaxTreeNode, UnaryOperatorNode, ValueNode } from './SyntaxTreeNodes.mjs';

// Order of operations
// postfix unary operators like factorial
// prefix unary operators like log, sqrt, negate (in order of right to left)
// binary operators like +-= etc (in order defined below)

// (higher number is evaluated first)
const OperatorPrecedence = {
    [LexemeType.BINARY_OPERATOR]: 0,
    [LexemeType.PREFIX_OPERATOR]: 1,
    [LexemeType.POSTFIX_OPERATOR]: 2,
}

const BinaryOperatorPrecedence = {
    [LexemeSubType.ASSIGN]: 0,

    [LexemeSubType.DIVIDE_LOW_PRECEDENCE] : 1,

    [LexemeSubType.ADD] : 2,
    [LexemeSubType.SUBTRACT] : 2,

    [LexemeSubType.MULTIPLY] : 3,
    [LexemeSubType.DIVIDE] : 3,
    [LexemeSubType.MODULO] : 3,

    [LexemeSubType.EXPONENTIATE] : 4,
};

export default function parse(lexemes) {
    // Do one-off stuff before the recursive bit

    // todo: find brackets and check they balance

    var tree = parseInner(lexemes);

    // todo: check syntax

    return tree;
}

function parseInner(lexemes) {
    // the one that does the actual work

    // slowly transforms an array of lexemes into a syntax tree by replacing lexeme groups with nodes

    var lexemes = lexemes.concat([]);
    
    // todo: won't work on empty lexemes list

    console.log('Start parseInner:', lexemes);
    while (lexemes.length > 1 || lexemes.some(l => l instanceof Lexeme)) {
        // if contains brackets, do that
        var startBracketIndex = lexemes.findIndex(l => l.subType == LexemeSubType.L_PAREN);
        if (startBracketIndex >= 0) {
            var nesting = 0;
            var endBracketIndex = -1;
            for (var i = 0; i < lexemes.length; i ++) {
                var lexeme = lexemes[i];
                if (lexeme.subType == LexemeSubType.L_PAREN) nesting += 1;
                else if (lexeme.subType == LexemeSubType.R_PAREN) {
                    nesting -= 1;
                    if (nesting == 0) endBracketIndex = i;
                    break;
                }
            }
            // todo: error if not found (or perhaps not as we do a bracket check before)

            var parsed = parseInner(lexemes.slice(startBracketIndex + 1, endBracketIndex));
            replaceSliceByEndIdx(startBracketIndex, endBracketIndex + 1, parsed);
        }
            // get info of outermost set
            // replace b1 to b2 with parseInner(after bracket to before bracket), continue
            
        // if contains function header syntax
            // ~~there can only be one set of this~~ nested functions will exist
            // parse that with separate parser & replace, continue
        
        // if it contains function call syntax
            // get info of outermost one
            // parse that with separate parser and replace, continue

        // if it contains a value token
        // get info of any of them, perform trivial replacement
        
        var valueIndex = lexemes.findIndex(l => l.type == LexemeType.VALUE);
        if (valueIndex >= 0) {
            lexemes[valueIndex] = new ValueNode(lexemes[valueIndex].value, lexemes[valueIndex].subType);
            continue;
        }

        // else it's an expression so do this bit:
        
        // find highest precedence operator
        var [lexeme, idx] = findHighestPrecedenceOperator();
        console.log('highest:', lexeme);
        if (lexeme.type == LexemeType.POSTFIX_OPERATOR) {
            replaceSlice(idx - 1, 2, new UnaryOperatorNode(lexemes[idx - 1], lexeme.subType));
        }
        else if (lexeme.type == LexemeType.PREFIX_OPERATOR) {
            replaceSlice(idx, 2, new UnaryOperatorNode(lexemes[idx + 1], lexeme.subType));
        }
        else if (lexeme.type == LexemeType.BINARY_OPERATOR) {
            replaceSlice(idx - 1, 3, new BinaryOperatorNode(lexemes[idx - 1], lexemes[idx + 1], lexeme.subType));
        }
        console.log('end loop:', lexemes);
        // else - we have problem
    }

    return lexemes[0];



    function findHighestPrecedenceOperator() {
        // search from end to start so that first occurences are deemed higher precedence
        var highestLexeme = null; // todo: what if there are no operators?
        var index = -1;
        for (var i = lexemes.length - 1; i >= 0; i --) {
            var crntLexeme = lexemes[i];
            if (! (crntLexeme instanceof Lexeme)) continue;
            if (! (crntLexeme.type in OperatorPrecedence)) continue;
            if (highestLexeme == null || hasHigherPrecedence(crntLexeme, highestLexeme)) {
                highestLexeme = crntLexeme;
                index = i;
            }
            console.log()
        }
        return [highestLexeme, index];
    }

    function hasHigherPrecedence(a, b) {
        // Returns whether precedence of a >= precedence of b.
        // (earlier has higher precedence so in the equal case a still has higher)
        if (a.type != b.type) {
            return OperatorPrecedence[a.type] >= OperatorPrecedence[b.type];
        }
        else if (a.type == LexemeType.BINARY_OPERATOR) {
            console.log(a.subType, b.subType, BinaryOperatorPrecedence[a.subType], BinaryOperatorPrecedence[b.subType])
            return BinaryOperatorPrecedence[a.subType] >= BinaryOperatorPrecedence[b.subType];
        }
        else if (a.type == LexemeType.PREFIX_OPERATOR) {
            return false; // latest prefix operators are executed first
        }
        else if (a.type == LexemeType.POSTFIX_OPERATOR) {
            return true; // earliest postfix operators are executed first
        }
        // else you goofed up todo: add proper error handling
    }

    function replaceSlice(startIdx, length, replaceVal) {
        // replace lexemes[startIdx:startIndex + length] with the single value replaceVal
        lexemes.splice(startIdx, length, replaceVal);
    }

    function replaceSliceByEndIdx(startIdx, endIdx, replaceVal) {
        // replace lexemes[startIdx:endIdx] with the single value replaceVal. endIdx not included
        replaceSlice(startIdx, endIdx - startIdx, replaceVal)
    }
}
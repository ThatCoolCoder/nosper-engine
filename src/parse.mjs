import { spnr } from './lib/spnr.mjs';
import { Lexeme, LexemeType, LexemeSubType } from './Lexeme.mjs';
import { AssignableNode, BinaryOperatorNode, FunctionCallNode, FunctionHeaderNode, SyntaxTreeNode, UnaryOperatorNode, ValueNode } from './SyntaxTreeNodes.mjs';
import ParseContext from './ParseContext.mjs';

// This parser is a little weird and uses a completely different method from v1
// However it was pretty easy to code, is quite extensible, and is decently understandable, so it's here to stay. Here's how it works:

// Instead of finding the lowest precedence operator and extracting that into the root of the tree, here it was decided to
// start from the leaves of the tree and work up. As there are initially no parent nodes in the tree to hold them, we instead insert them into
// the array that contained the lexemes, in place of the lexemes that were consumed. This is then repeated,
// replacing [the next-level operator lexeme and the already-parsed tree nodes that it operates on] with a syntax tree node of the operator and its children.
// Finally the array will consist of just a single tree node, at which point the work is done
// Various sub-parsers are used to parse bits of syntax that aren't the default expression type (eg function def, function call, get rid of nasty brackets)



// Order of operations
// first postfix unary operators like factorial
// then prefix unary operators like log, sqrt, negate (in order of right to left, ie closest to value to far from value)
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

    if (lexemes.length == 0) return new ValueNode(0, LexemeSubType.NUMBER);

    var lexemes = lexemes.concat([]);
    
    while (lexemes.length > 1 || lexemes.some(l => l instanceof Lexeme)) {
        // if it contains function header, do that (must do before paren section below as function def includes paren)
        // perhaps we should have more semantics attached to parens because we can differentiate this in lexing
        var functionDefIndex = lexemes.findIndex(l => l.subType == LexemeSubType.FUNCTION_DEF);
        if (functionDefIndex >= 0) {
            var endBracketIndex = -1;
            for (var i = functionDefIndex; i < lexemes.length; i ++) {
                if (lexemes[i].subType == LexemeSubType.R_PAREN) {
                    endBracketIndex = i;
                    break;
                }
            }
            var parsed = parseFunctionHeader(lexemes.slice(functionDefIndex, endBracketIndex + 1));
            replaceSliceByEndIdx(functionDefIndex, endBracketIndex + 1, parsed);
            continue;
        }

        // if it has function call, do that (also have to do before paren)
        var functionCallIndex = lexemes.findIndex(l => l.type == LexemeType.FUNCTION_CALL);
        if (functionCallIndex >= 0) {
            console.log(functionCallIndex);
            var nesting = 0;
            var endBracketIndex = -1;
            for (var i = functionCallIndex + 1; i < lexemes.length; i ++) { // functionCallIndex + 1 to skip straight to the open paren
                var lexeme = lexemes[i];
                if (lexeme.subType == LexemeSubType.L_PAREN) nesting ++;
                else if (lexeme.subType == LexemeSubType.R_PAREN) {
                    nesting --;
                    if (nesting == 0) {
                        endBracketIndex = i
                        break;
                    }
                }
            }
            var parsed = parseFunctionCall(lexemes.slice(functionCallIndex, endBracketIndex + 1));
            replaceSliceByEndIdx(functionCallIndex, endBracketIndex + 1, parsed);
            continue;
        }

        // if contains brackets, do that
        var startBracketIndex = lexemes.findIndex(l => l.subType == LexemeSubType.L_PAREN);
        if (startBracketIndex >= 0) {
            var nesting = 0;
            var endBracketIndex = -1;
            for (var i = startBracketIndex; i < lexemes.length; i ++) {
                var lexeme = lexemes[i];
                if (lexeme.subType == LexemeSubType.L_PAREN) nesting += 1;
                else if (lexeme.subType == LexemeSubType.R_PAREN) {
                    nesting -= 1;
                    if (nesting == 0) {
                        endBracketIndex = i;
                        break;
                    }
                }
            }
            // todo: error if not found (or perhaps not as we do a bracket check before)

            var parsed = parseInner(lexemes.slice(startBracketIndex + 1, endBracketIndex));
            replaceSliceByEndIdx(startBracketIndex, endBracketIndex + 1, parsed);
            continue;
        }

        // if it contains a value, convert that
        var valueIndex = lexemes.findIndex(l => l.type == LexemeType.VALUE);
        if (valueIndex >= 0) {
            lexemes[valueIndex] = new ValueNode(lexemes[valueIndex].value, lexemes[valueIndex].subType);
            continue;
        }

        // if it contains an assignable lexeme, do that
        var assignableIndex = lexemes.findIndex(l => l.subType == LexemeSubType.VARIABLE_ASSIGNMENT_NAME);
        if (assignableIndex >= 0) {
            lexemes[assignableIndex] = new AssignableNode(lexemes[assignableIndex].value);
            continue;
        }

        // else it's an expression so do this bit:
        
        // find highest precedence operator
        var [lexeme, idx] = findHighestPrecedenceOperator();
        if (lexeme.type == LexemeType.POSTFIX_OPERATOR) {
            replaceSlice(idx - 1, 2, new UnaryOperatorNode(lexemes[idx - 1], lexeme.subType));
        }
        else if (lexeme.type == LexemeType.PREFIX_OPERATOR) {
            replaceSlice(idx, 2, new UnaryOperatorNode(lexemes[idx + 1], lexeme.subType));
        }
        else if (lexeme.type == LexemeType.BINARY_OPERATOR) {
            replaceSlice(idx - 1, 3, new BinaryOperatorNode(lexemes[idx - 1], lexemes[idx + 1], lexeme.subType));
        }
        else {
            throw new Error('todo: write message, confused at what to do during parsing');
        }
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

function parseFunctionHeader(lexemes) {
    var ctx = new ParseContext(lexemes);

    if (ctx.crntItem.subType != LexemeSubType.FUNCTION_DEF) throw new Error('todo: write message, you say is func but is not bruh');
    ctx.next();

    if (ctx.crntItem.subType != LexemeSubType.FUNCTION_ASSIGNMENT_NAME) throw new Error('todo: write message, no func name');
    var functionName = ctx.crntItem.value;
    ctx.next();
    
    if (ctx.crntItem.subType != LexemeSubType.L_PAREN) throw new Error('todo: write message, no open paren on func');
    ctx.next();

    var lastWasComma = true;
    var variables = [];
    while (ctx.crntItem.subType != LexemeSubType.R_PAREN) {
        if (ctx.finished) throw new Error('todo: write message');
        if (lastWasComma) {
            if (ctx.crntItem.subType == LexemeSubType.COMMA) throw new Error('todo: write message, 2 commas in a row');
            variables.push(ctx.crntItem.value);
            ctx.next();
        }
        else {
            if (ctx.crntItem.subType == LexemeSubType.VARIABLE_ASSIGNMENT_NAME) throw new Error('todo: write message, 2 variables in a row');
            ctx.next();
        }
        var lastWasComma = ctx.peekPrevious().subType == LexemeSubType.COMMA;
    }

    return new FunctionHeaderNode(functionName, variables);
}

function parseFunctionCall(lexemes) {
    var ctx = new ParseContext(lexemes);

    if (ctx.crntItem.type != LexemeType.FUNCTION_CALL) throw new Error('todo: write message, you say is func but is not');
    var functionName = ctx.crntItem.value;
    ctx.next();

    if (ctx.crntItem.subType != LexemeSubType.L_PAREN) throw new Error('todo: write message, expected (');
    ctx.next();
    
    var args = [];
    var nestingLevel = 0;
    var crntArg = [];
    while (!ctx.finished) {
        // Algorithm: read until balanced comma, parse that all as arg, skip over comma, repeat until balanced close

        if (ctx.crntItem.subType == LexemeSubType.L_PAREN) {
            nestingLevel ++;
            crntArg.push(ctx.crntItem);
        }
        else if (ctx.crntItem.subType == LexemeSubType.R_PAREN) {
            if (nestingLevel == 0) {
                break;
            }
            nestingLevel --;
            crntArg.push(ctx.crntItem);
        }
        else if (ctx.crntItem.subType == LexemeSubType.COMMA && nestingLevel == 0) {
            // we have reached end of crnt arg
            saveCrntArg();
        }
        else {
            crntArg.push(ctx.crntItem);
        }
        ctx.next();
    }
    if (ctx.peekPrevious().subType == LexemeSubType.COMMA) throw new Error('todo: write message. Argument missing');
    if (crntArg.length > 0) saveCrntArg();

    function saveCrntArg() {
        if (crntArg.length > 0) {
            args.push(parse(crntArg));
            crntArg = [];
        }
        else {
            throw new Error('todo: write message. Argument missing');
        }
    }

    return new FunctionCallNode(functionName, args);
}
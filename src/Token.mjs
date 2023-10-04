import { spnr } from './lib/spnr.mjs';

// A note on token types & subtypes:
// We could do with only subtypes, but we have types as well just to make comparisons and checks briefer - instead of checking for every single operator.
// If there is a token type which needs no subtypes, give it subtype NONE

export const TokenType = {
    ASSIGN: 0, // yes one could argue that this is a binary operator but assign needs special-case parsing later so might as well make it special now
    BINARY_OPERATOR: 0,
    PREFIX_OPERATOR: 0,
    POSTFIX_OPERATOR: 0,
    VALUE: 0,
    PAREN: 0,
    FUNCTION_CALL: 0,
    SEPARATOR: 0
}
spnr.obj.toEnum(TokenType, true);

export const TokenSubType = {
    NONE: 0,
    
    // None for assign

    // binary operator
    ADD: 0,
    SUBTRACT: 0,
    MULTIPLY: 0,
    DIVIDE: 0,
    DIVIDE_LOW_PRECEDENCE: 0,
    MODULO: 0,
    EXPONENTIATE: 0,
    IF: 0,
    NOT_IF: 0,

    // prefix operator: trig
    SINE: 0,
    ARC_SINE: 0,
    COSECANT: 0,
    COSINE: 0,
    ARC_COSINE: 0,
    SECANT: 0,
    TANGENT: 0,
    ARC_TANGENT: 0,
    COTANGENT: 0,

    // prefix operator: not trig
    NEGATE: 0,
    SQUARE_ROOT: 0,
    CUBE_ROOT: 0,
    ABSOLUTE_VALUE: 0,
    LOGARITHM: 0,
    NATURAL_LOGARITHM: 0,
    ROUND: 0,
    FLOOR: 0,
    CEILING: 0,
    // postfix operator:
    FACTORIAL: 0,

    // value
    LITERAL: 0,
    IDENTIFIER: 0, // Generally a variable but can also be a function name in function definition
    PREVIOUS_ANSWER: 0,

    // paren
    L_PAREN: 0,
    L_SQUARE_PAREN: 0,
    R_PAREN: 0,
    R_SQUARE_PAREN: 0,

    // None for function call

    // separator
    COMMA: 0,
    SEMICOLON: 0
}
spnr.obj.toEnum(TokenSubType, true);

// Higher precedence = evaluated first
export const OperatorPrecedence = {
    [TokenSubType.ADD]: 1,
    [TokenSubType.SUBTRACT]: 1,
    [TokenSubType.DIVIDE_LOW_PRECEDENCE]: 1,
    [TokenSubType.IF] : 1.5, // all numbers are floats so we might as well use them
    [TokenSubType.NOT_IF] : 1.5,
    [TokenSubType.MULTIPLY]: 2,
    [TokenSubType.DIVIDE]: 2,
    [TokenSubType.MODULO]: 2,

    [TokenSubType.SINE]: 3,
    [TokenSubType.ARC_SINE]: 3,
    [TokenSubType.COSECANT]: 3,
    [TokenSubType.COSINE]: 3,
    [TokenSubType.ARC_COSINE]: 3,
    [TokenSubType.SECANT] : 3,
    [TokenSubType.TANGENT]: 3,
    [TokenSubType.ARC_TANGENT]: 3,
    [TokenSubType.COTANGENT]: 3,

    [TokenSubType.NEGATE]: 3,
    [TokenSubType.SQUARE_ROOT]: 3,
    [TokenSubType.CUBE_ROOT]: 3,
    [TokenSubType.ABSOLUTE_VALUE]: 3,
    [TokenSubType.LOGARITHM]: 3,
    [TokenSubType.NATURAL_LOGARITHM]: 3,
    [TokenSubType.ROUND]: 3,
    [TokenSubType.FLOOR]: 3,
    [TokenSubType.CEILING]: 3,

    [TokenSubType.EXPONENTIATE]: 4,
    [TokenSubType.FACTORIAL]: 4,

}

export class Token {
    constructor(type, subType, value) {
        this.type = type;
        this.subType = subType;
        this.value = value;
        this.extraPrecedence = 0;
    }
}

export class ParsedFunctionCallToken extends Token {
    constructor(type, subType, value, args) {
        super(type, subType, value);
        this.args = args;
    }
}
import { spnr } from './lib/spnr.mjs'

export const TokenType = {
    BINARY_OPERATOR: 0,
    UNARY_OPERATOR: 0,
    VALUE: 0,
    PAREN: 0,
    FUNCTION_CALL: 0,
    SEPARATOR: 0
}
spnr.obj.toEnum(TokenType, true);

export const TokenSubType = {
    OTHER: 0,

    // binary operator
    ADD: 0,
    SUBTRACT: 0,
    MULTIPLY: 0,
    DIVIDE: 0,
    MODULO: 0,
    EXPONENTIATE: 0,
    ASSIGN: 0,
    FUNCTION_ASSIGN: 0,

    // unary operator: trig
    NEGATE: 0,
    SINE: 0,
    ARC_SINE: 0,
    COSINE: 0,
    ARC_COSINE: 0,
    TANGENT: 0,
    ARC_TANGENT: 0,
    // unary operator: not trig
    SQUARE_ROOT: 0,
    CUBE_ROOT: 0,
    ABSOLUTE_VALUE: 0,
    LOGARITHM: 0,
    NATURAL_LOGARITHM: 0,
    ROUND: 0,
    FLOOR: 0,
    CEILING: 0,

    // value
    LITERAL: 0,
    VARIABLE: 0,

    // paren
    L_PAREN: 0,
    R_PAREN: 0,

    // function call
    UNPARSED_FUNCTION_CALL: 0,
    PARSED_FUNCTION_CALL: 0,

    // separator
    ARGUMENT_SEPARATOR: 0
}
spnr.obj.toEnum(TokenSubType, true);

// Higher precedence = evaluated first
export const OperatorPrecedence = {
    [TokenSubType.ASSIGN]: 0,
    [TokenSubType.FUNCTION_ASSIGN]: 0,
    [TokenSubType.ADD]: 1,
    [TokenSubType.SUBTRACT]: 1,
    [TokenSubType.MULTIPLY]: 2,
    [TokenSubType.DIVIDE]: 2,
    [TokenSubType.MODULO]: 2,
    [TokenSubType.EXPONENTIATE]: 3,

    [TokenSubType.NEGATE]: 4,
    [TokenSubType.SINE]: 4,
    [TokenSubType.ARC_SINE]: 4,
    [TokenSubType.COSINE]: 4,
    [TokenSubType.ARC_COSINE]: 4,
    [TokenSubType.TANGENT]: 4,
    [TokenSubType.ARC_TANGENT]: 4,
    [TokenSubType.SQUARE_ROOT]: 4,
    [TokenSubType.CUBE_ROOT]: 4,
    [TokenSubType.ABSOLUTE_VALUE]: 4,
    [TokenSubType.LOGARITHM]: 4,
    [TokenSubType.NATURAL_LOGARITHM]: 4,
    [TokenSubType.ROUND]: 4,
    [TokenSubType.FLOOR]: 4,
    [TokenSubType.CEILING]: 4,

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
// Output of lexer.
// Perhaps lexeme is not "correct" term but I think it makes sense

import { spnr } from './lib/spnr.mjs';

export const LexemeType = {
    BINARY_OPERATOR: 0,
    PREFIX_OPERATOR: 0,
    POSTFIX_OPERATOR: 0,
    TERNARY_OPERATOR: 0,
    SEPARATOR: 0,
    FUNCTION_CALL: 0,
    VALUE: 0,
    ASSIGNABLE: 0,
    PAREN: 0,
    KEYWORD: 0,
};
spnr.obj.toEnum(LexemeType, true);

export const LexemeSubType = {
    NONE: 0,

    // binary operator
    ADD: 0,
    SUBTRACT: 0,
    MULTIPLY: 0,
    DIVIDE: 0,
    DIVIDE_LOW_PRECEDENCE: 0,
    MODULO: 0,
    EXPONENTIATE: 0,
    ASSIGN: 0,

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

    // postfix operator
    FACTORIAL: 0,

    // ternary operator
    TERNARY_IF_ELSE: 0,

    // separator
    COMMA: 0,

    // none for function call

    // value
    NUMBER: 0,
    VARIABLE: 0, 
    PREVIOUS_ANSWER: 0,
    CONSTANT: 0,
    
    // assignable
    VARIABLE_ASSIGNMENT_NAME: 0,
    FUNCTION_ASSIGNMENT_NAME: 0,

    // paren
    L_PAREN: 0,
    L_CURLY_PAREN: 0,
    R_PAREN: 0,
    R_CURLY_PAREN: 0,

    // keyword
    FUNCTION_DEF: 0,
};
spnr.obj.toEnum(LexemeSubType, true);

export class Lexeme {
    constructor(type, subType, value) {
        this.type = type;
        this.subType = subType;
        this.value = value;
    }
}
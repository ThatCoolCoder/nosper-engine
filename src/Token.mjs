import { spnr } from './lib/spnr.mjs';

export const TokenType = {
    NUMBER: 0,
    TEXT: 0,
    SYMBOLIC_OPERATOR: 0,
    FUNCTION_CALL: 0,
    PAREN: 0,
}
spnr.obj.toEnum(TokenType, true);

export class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}
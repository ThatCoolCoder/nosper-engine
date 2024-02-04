import { spnr } from "./lib/spnr.mjs";
import * as Errors from "./Errors.mjs";

// todo: come up with good names that make the struct with type and the raw value distinct, as it's going to get confusing very fast
// var/value initially seems promising but not all type-associated-values are vars

export const Types = {
    SCALAR: 0,
    FUNCTION: 0,
    LIST: 0,
};

export function makeScalar(value) {
    return { type: Types.SCALAR, value };
}

export function makeList(value) {
    // if (! value instanceof Array) throw error todo:
    return { type: Types.LIST, value };
}

export function safelyGetValue(a, validTypes) {
    // if validType is not a list, checks if a == type instead of in list of types
    if (validTypes instanceof Array) {
        if (! validTypes.includes(a.type)) throw new Errors.TypeError();
    }
    else {
        if (a.type != validTypes) throw new Errors.TypeError();
    }

    return a.value;
}

spnr.obj.toEnum(Types, true);
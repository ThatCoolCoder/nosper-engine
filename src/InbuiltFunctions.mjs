// Things that look like ordinary user-defined functions but have way more capability as they're implemented in js.
// At this stage, mainly used for filling in things we haven't yet gotten working with native syntax (or don't want to)
// (yes I know since these are hard-coded we could know them at compile time and not need a prefix but that's requires effort
// and also it might break if someone tries loading an old syntax tree into a new engine version)

import { ValueNode } from "./SyntaxTreeNodes.mjs";
import { LexemeSubType } from "./Lexeme.mjs";
import * as Errors from "./Errors.mjs";
import { Types, safelyGetValue } from "./Types.mjs";

// If variadic is false (default), the function must be given exactly nArgs. These args will then be passed in conditionally to the definition, after the context.
// If variadic is true, nArgs is only a minimum (if absent, min is zero), and args are passed as an array as the second argument

export const InbuiltFunctions = {
    'ifelse': { nArgs: 3, definition: (_ctx, cond, a, b) => safelyGetValue(cond, Types.SCALAR) ? a : b },
    // Todo: could add loops here if we had lambdas or blocks/multiple statements (as a loop isn't very useful without being able to have multiple lines occur)

    'del_var': { nArgs: 1, definition: (ctx, rhs) => {
        // todo: Rip this one doesn't work now since now we have the arguments pre-evaluated instead of being able to mess around with their insides
        // perhaps we can come up with some special syntax for a node that protects its contents from being evaluated, a raw thing or something.
        // perhaps we add another data type for expression
        
        if (! rhs instanceof ValueNode || rhs.subType != LexemeSubType.VARIABLE) {
            throw new Errors.EvaluationError("Cannot delete this as it's not a variable");
        }
        
        // I decided against implementing this scanning functionality into the context itself
        var reversed = ctx.scopeStack.concat([]);
        reversed.reverse(); // whyyyyy no non-in-place reverse
        for (var crntScope of reversed) {
            if (crntScope.variables.isDefined(rhs.value)) {
                crntScope.variables.delete(rhs.value);
                return 0;
            }
        }

        throw new Errors.EvaluationError("Can't delete this variable as it doesn't exist");
    }},
}
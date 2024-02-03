// Things that look like ordinary user-defined functions but have way more capability as they're implemented in js.
// At this stage, mainly used for filling in things we haven't yet gotten working with native syntax (or don't want to)
// (yes I know since these are hard-coded we could know them at compile time and not need a prefix but that's requires effort
// and also it might break if someone tries loading an old syntax tree into a new engine version)

import { FunctionCallNode, ValueNode } from "./SyntaxTreeNodes.mjs";
import { LexemeSubType } from "./Lexeme.mjs";
import * as Errors from "./Errors.mjs";

// If variadic is false (default), the function must be given exactly nArgs. These args will then be passed in conditionally to the definition, after the context.
// If variadic is true, nArgs is only a minimum (if absent, min is zero), and args are passed as an array as the second argument

export const InbuiltFunctions = {
    'ifelse': { nArgs: 3, definition: (ctx, cond, a, b) => cond.evaluate(ctx) ? a.evaluate(ctx) : b.evaluate(ctx) },
    // Todo: could add loops here if we had lambdas or blocks/multiple statements (as a loop isn't very useful without being able to have multiple lines occur)

    'del_var': { nArgs: 1, definition: (ctx, rhs) => {
        // I decided against implementing this scanning functionality into the context itself

        if (! rhs instanceof ValueNode || rhs.subType != LexemeSubType.VARIABLE) {
            throw new Errors.EvaluationError("Cannot delete this as it's not a variable");
        }

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

    // todo: this one won't work yet as we don't have a way of giving a reference to a function without just trying to call it.
    // Could come up with hacky syntax for that but in the long term I think it's better to move to a system where functions are just a different type of variable.
    // Only problem is that then we run into issues because how would we say eg `a = myfunc`, we'd need another special char for prefixing multi letter vars here.
    // Can't use underscore. Unless we strip underscore from start when storing it and just use it as a parsing indicator. aaaaaa
    // Wait it's already a parsing indicator, we'd just need to consistently strip it from start

    'call': { variadic: true, nArgs: 1, definition: (ctx, args) => {
        // Lazy way to reuse functionality of function call
        var n = new FunctionCallNode(args[0], args.slice(1));
        return n.evaluate(ctx);
    }},
}
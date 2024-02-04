# Nosper Engine

Mathematical engine (calculator) library written in Javascript that works in browser environments and in nodejs.

This is the v2dev branch - here we are developing an improved engine that will be more capable and hopefully more maintainable.

## Usage

This project uses a rolling release system where versions are kept in git branches, so add the project as a git submodule with `git submodule add https://github.com/ThatCoolCoder/nosper-engine`. Then navigate to the directory where the submodule was cloned to, and choose the latest stable branch with `git checkout v1`. 

We use ES6 modules so import it as so: (it's the same for browser and node)

```javascript
import { Evaluator } from 'path/to/nosper-engine/src/Evaluator.mjs';
var evaluator = new Evaluator();
console.log(evaluator.evaluate('5 * 2')); // will print { type: "NUMBER", value: 10 }
```

`Evaluator.evaluate()` and related functions may throw an `Errors.EvaluationError`. See `src/Errors.mjs` for list of all derived errors, if you wish to handle them separately. Note that new derived errors may be created without bumping the version.

Switch between degrees and radians by setting `evaluator.context.useRadians`.

## Input syntax

The calculator has a fairly complex input langauge - see [InputLanguage.md](InputLanguage.md) for more info.

## Advanced usage

### Using loadables

A loadable is a collection of predefined functions and variables that can be loaded at runtime. They can be managed using `evaluator.applyLoadable()` and `evaluator.removeLoadable()`, or the equivalent functions on `EvaluationContext`.

### Creating loadables

Loadables are just dictionaries of data (no class is needed - this means loadables can be provided by libraries without requiring those libraries to have any deps). Below is the structure required:
```js
const myLoadable = {
    name: 'My amazing loadable',
    description: 'I don\'t need a description, it\'s just that amazing',
    variables: {
        'a': { value: 5, description: 'a' },
        'm_cow': { value: 500, description: 'The mass of a single cow, in kilograms' },
    },
    functions: {
        // note that name, args and body are combined together when applying, so the end result would be equivalent to:
        //      def calculate_acceleration(f, m) = f / m
        'calculate_acceleration' : { args: ['f', 'm'], body: 'f / m', description: 'Calculate acceleration of an object when a force is applied' } 
    }
}
```

### Separate compilation and evaluating

If for some reason, you want to compile an expression separately from evaluating it (such as in the case where you want to re-evaluate a function with different variables), you can use `var compiled = evaluator.compile(expression)` and then later `evaluator.evaluateCompiledExpression(expr)`. This means that the expression isn't parsed for every invocation, improving performance.

## Releases

This project uses a rolling release system, where stable versions can be obtained through branches in the form of `vN`. The current stable version is on branch `v1`.

(Maintainers: please update this doc when creating a new release branch)

## Future plans:
- lambdas/anonymous functions. 
    - probably not that hard to do with current syntax, just need to make an inline function lexer+parser
    - difficulty will be that it requires data types (or we could just duck-type), and requires elegant syntax for calling the value of a variable (so in other words a level of indirection similar to pointers)
        - perhaps we can prohibit variables and functions from having the same name and thus the function call operator will call the value of a variable
            - store in dict of { type: 'scalar', value: 42 } to prevent overlap? or manual checking between 2 dicts is neater and more robust?
- ? make current function def system just syntactic sugar. We only have variables, the @ becomes a ~~prefix~~ double prefix(?) operator that invokes the value of the variable after it
    - if following item is not invokable then compile or runtime error
    - compile error if is a literal or something ridiculous
    - will remove special-case parsing
        - actually it won't as now we still need to treat multi-letter function names correctly when they're being called, and sugar-assigned functions will not be passable unless we allow prefixing with an underscore or something
    - also means that we will now need a set data type to be constructable so that the values after the function
        - and then inevitably people (i.e me) will want set deconstruction, intersection, union etc. Which sounds like excessive scope for simply allowing lambdas
        - ok maybe this idea is for v3
- conditions
    - for now is implemented as inbuilt function like excel (`@ifelse(cond, a, b)`) but native ternary would be amazing.
    - ternary will be specified to be short circuiting so that we can use it for both conditional "flow" and selecting values
- add logical operators
    - |, ^, &, ~ are all free in the syntax
    - should we have a separate bool type or just do it c-style
- immutable values for inbuilt stuff
    - make loaded loadables immutable?
    - requires attaching payload to values
- strict data typing?
    - can do optional typing, where everything is assumed to be a number but in function headers you can define x: func or whatever syntax and there will be a compile/runtime error on doing that
- distinction between expressions and statement?
    - requires moderate reworking as we have to make parser smarter
- (minor) move to storing custom functions as (what was this going to say?)

## Overview of the code

The key components of the engine are the evaluator, parser, lexer and tokeniser. They'll be described at a high level here, for more information view comments in the referenced files. It's a bit rough and ready at the moment as I wrote most of it in one day.

The first step of evaluation is tokenising the expression into fairly dumb tokens. The tokenisation is done by a function in `tokenise.mjs`. It was decided to use nested functions for tokenising rather than a class as it allows easy state preservation while also keeping "thread safety" (asynchronous safety) if called multiple times. See `Token.mjs` for info on what data the tokens store.

Next, the lexer (`lex.mjs`) converts these tokens into "lexemes" (`Lexeme.mjs`). Lexeme is probably not the "correct" name for this however it makes sense given that it's the output of the lexer. The lexer is structured similarly to the tokeniser. Lexemes are somewhat like tokens but they contain information about their semantic meaning. Technically this distinction between tokeniser/lexer isn't essential, however if we decide to make more complex syntax (where symbols have a completely different meaning in different contexts), this makes life a lot easier.

The parser (`parse.mjs`, another set of nested functions) converts these lexemes into a syntax tree (`SyntaxTreeNodes.mjs`). It takes a slightly odd approach to parsing however. See

The evaluator (`Evaluator.mjs`, an actual class) doesn't do much. It only manages the other components, handles loadables, and keeps track of the evaluation context. Its purpose is to provide a simple interface to consumers.

An `EvaluationContext` allows for easy storage of information between (and during) evaluations. It's passed around when executing the syntax tree, for instance. Among other things, it defines an array of scopes (which each contain functions and variables), which act to provide local/global variables to functions. Things at the end of the array (aka top of the stack) pertain to the most local function. Base constants are also defined through the default scope. Scopes are managed by function call nodes.

For reasons, a leading underscore will be stripped from variables behind the scenes (specifically, during the lexing stage). This is applied to both variable assignment and use, so it's completely transparent to the user. This then allows the `def` and `@` syntax to work without leading underscores, and without them having to do complex thinking about stripping leading underscores (the reason we're able to get away with no leading underscore to signify multi-char is that unlike variables, there is already a special signifying token)
# nosper-engine

Mathematical engine (calculator) library written in Javascript that works in browser environments and in nodejs.

This is the v2dev branch - here we are developing an improved engine that will be more capable and hopefully more maintainable.

todo still:
- get loadables working fully
- make decision on precedence of sinx^2 (currently = (sin(x))^2)

## Usage

This project uses a rolling release system where versions are kept in git branches, so add the project as a git submodule with `git submodule add https://github.com/ThatCoolCoder/nosper-engine`. Then navigate to the directory where the submodule was cloned to, and choose the latest stable branch with `git checkout v1`. 

We use ES6 modules so import it as so: (it's the same for browser and node)

```javascript
import { Evaluator } from 'path/to/nosper-engine/src/Evaluator.mjs';
var evaluator = new Evaluator();
console.log(evaluator.evaluate('5 * 2')); // will print 10
```

`Evaluator.evaluate()` and related functions may throw an `Errors.EvaluationError`. See `src/Errors.mjs` for list of all derived errors, if you wish to handle them separately. Note that new derived errors may be created without bumping the version.

## Input syntax

The calculator has a fairly complex input langauge and documentation needs to be created. 

## Advanced usage

#### Loadables

A `Loadable` is a collection of predefined functions and variables that can be loaded at runtime. They can be managed using `evaluatorInstance.applyLoadable()` and `evaluatorInstance.removeLoadable()`.

#### Separate compilation and evaluating

If for some reason, you want to compile an expression separately from evaluating it (such as in the case where you want to re-evaluate a function with different variables), you can use `var expr = evaluatorInstance.compile()` and then later `evaluatorInstance.evaluateCompiledExpression(expr)`. This means that the expression isn't parsed for every invocation, improving performance

## Releases

This project uses a rolling release system, where stable versions can be obtained through branches in the form of `vN`. The current stable version is on branch `v1`.

(Maintainers: please update this doc when creating a new release branch)

## Creating loadables

Loadables are just dictionaries of data (no class is needed). Below is the structure required:
```js
const myLoadable = {
    name: 'My amazing loadable',
    description: 'I don\'t need a description, it\'s just that amazing',
    variables: {
        'a': { value: 5, description: 'a' },
        'm_cow': { value: 500, description: 'The mass of a single cow' },
    },
    functions: {
        // 'calculate_acceleration' : { args: ['f', 'm'], value: evaluator.compile(') }
    }
    // todo: finish writing this
}
``` 

## Overview of the code

The key components of the engine are the evaluator, parser, lexer and tokeniser. They'll be described at a high level here, for more information view comments in the referenced files. It's a bit rough and ready at the moment as I wrote most of it in one day.

The first step of evaluation is tokenising the expression into fairly dumb tokens. The tokenisation is done by a function in `tokenise.mjs`. It was decided to use nested functions for tokenising rather than a class as it allows easy state preservation while also keeping "thread safety" (asynchronous safety) if called multiple times. See `Token.mjs` for info on what data the tokens store.

Next, the lexer (`lex.mjs`) converts these tokens into "lexemes" (`Lexeme.mjs`). Lexeme is probably not the "correct" name for this however it makes sense given that it's the output of the lexer. The lexer is structured similarly to the tokeniser. Lexemes are somewhat like tokens but they contain information about their semantic meaning. Technically this distinction between tokeniser/lexer isn't essential, however if we decide to make more complex syntax (where symbols have a completely different meaning in different contexts), this makes life a lot easier.

The parser (`parse.mjs`, another set of nested functions) converts these lexemes into a syntax tree (`SyntaxTreeNodes.mjs`). It takes a slightly odd approach to parsing however. See

The evaluator (`Evaluator.mjs`, an actual class) doesn't do much. It only manages the other components, handles loadables, and keeps track of the evaluation context. Its purpose is to provide a simple interface to consumers.

An `EvaluationContext` allows for easy storage of information between (and during) evaluations. It's passed around when executing the syntax tree, for instance. Among other things, it defines an array of scopes (which each contain functions and variables), which act to provide local/global variables to functions. Things at the end of the array (aka top of the stack) pertain to the most local function. Base constants are also defined through the default scope. Scopes are managed by function call nodes.
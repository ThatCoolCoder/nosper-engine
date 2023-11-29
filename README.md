# nosper-engine

Mathematical engine (calculator) library written in Javascript that works in browser environments and in nodejs.

This is the v2dev branch - here we are sketching out an improved engine that will be more capable and hopefully more maintainable.

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

The calculator has a fairly complex input langauge and I ought to add documentation here, but for the time being you can install [nosper-tty](https://github.com/ThatCoolCoder/nosper-tty) and use its help menu.

## Advanced usage

#### Loadables

A `Loadable` is a collection of predefined functions and variables that can be loaded at runtime. They should be managed using `evaluatorInstance.load()` and `evaluatorInstance.unload()`. It is the responsibility of the consumer to manage defining, applying or removing them. There is also the possibility of collections of loadables being provided by external libraries.

#### Separate compilation and evaluating

If for some reason, you want to compile an expression separately from evaluating it (such as in the case where you want to re-evaluate a function with different variables), you can use `evaluatorInstance.compileSingleExpression()` and then later `evaluatorInstance.evaluateCompiledExpression`. Note that you cannot use a semicolon to insert multiple expressions to `compileSingleExpression`.

## Releases

This project uses a rolling release system, where stable versions can be obtained through branches in the form of `vN`. The current stable version is on branch `v1`.

(Maintainers: please update this doc when creating a new release branch)

## Overview of the code

The key components of the engine are the evaluator, parser, lexer and tokeniser. They'll be described at a high level here, for more information view comments in the referenced files.

The first step of evaluation is tokenising the expression into fairly dumb tokens. The tokenisation is done by a function in `tokenise.mjs`. It was decided to use nested functions for tokenising rather than a class as it allows easy state preservation while also keeping "thread safety" (asynchronous safety) if called multiple times. See `Token.mjs` for info on what data the tokens store.

Next, the lexer (`lex.mjs`) converts these tokens into "lexemes" (`Lexeme.mjs`). The lexer is structured similarly to the tokeniser. Lexemes are somewhat like tokens but they contain information about their semantic meaning. Technically this distinction between tokeniser/lexer isn't essential, however if we decide to make more complex syntax (where symbols have a completely different meaning in different contexts), this makes life a lot easier.

The parser (`parse.mjs`, another set of nested functions) converts these lexemes into a syntax tree (`SyntaxTreeNodes.mjs`). It takes a slightly odd approach to parsing however. See

The evaluator (`Evaluator.mjs`, an actual class) doesn't do much. It only manages the other components, handling loadables, and keeping track of the evaluation context. Its true purpose is to provide a simple interface to consumers.

An `EvaluationContext` allows for easy storage of information between (and during) evaluations. It's passed around when executing the syntax tree, for instance. Among other things, it defines an array of scopes (which each contain functions and variables), which act to provide local/global variables to functions. Things at the end of the array (aka top of the stack) pertain to the most local function. Base constants are also defined through the default scope. Scopes are managed by function call nodes.
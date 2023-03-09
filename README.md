# nosper-engine

Mathematical engine (calculator) library written in Javascript that works in browser environments and in nodejs.

## Usage:

Add the project as a git submodule. We use ES6 modules so import it as so: (it's the same for browser and node)

```javascript
import { Evaluator } from 'path/to/nosper-engine/src/Evaluator.mjs';
var evaluator = new Evaluator();
console.log(evaluator.evaluate('5 * 2')); // will print 10
```

`Evaluator.evaluate()` may throw an `Errors.EvaluationError`. See `src/Errors.mjs` for list of all derived errors, if you wish to handle them separately.

The calculator has a fairly complex input langauge and I ought to add documentation here, but for the time being you can install [nosper-tty](https://github.com/ThatCoolCoder/nosper-tty) and use its help menu.

## Releases

This project uses a rolling release system, where stable versions can be obtained through branches in the form of `vN`. The current stable version is on branch `v1`.

(Maintainers: please update this doc when creating a new release branch)

## Loadables

A `Loadable` is a collection of predefined functions and variables that can be loaded at runtime. They should be loaded using `Evaluator.load()`. It is the responsibility of the consumer to manage defining, applying or removing them. There is also the possibility of collections of loadables being provided by external libraries. 
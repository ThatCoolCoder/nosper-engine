# nosper-engine

Mathematical engine (calculator) library written in Javascript. Should be able to run in both browser and node (browser probably needs work, though).

## Usage:

Add the project as a git submodule. We use ES6 modules so import it as so (works on ):

```javascript
import { Evaluator } from './nosper-engine/src/Evaluator.mjs';
var evaluator = new Evaluator();
console.log(evaluator.evaluate('5 * 2')); // will print 10
```

`Evaluator.evaluate()` may throw an `Errors.EvaluationError`. See `src/Errors.mjs` for list of all derived errors, if you wish to handle them separately.

The calculator has a fairly complex input langauge and I ought to add documentation here, but for the time being you can install [nosper-tty](github.com/ThatCoolCoder/nosper-tty) and use its help menu.
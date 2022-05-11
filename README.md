# nosper-engine

Mathematical engine (calculator) library written in Javascript. Should be able to run in both browser and node.

## Usage:

Add the project as a git submodule. We use ES6 modules so import it as so:

```javascript
import { Evaluator } from './nosper-engine/src/Evaluator.mjs';
var evaluator = new Evaluator();
evaluator.evaluate('5 * 2');
```

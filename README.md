# nosper-engine

Mathematical engine (calculator) library written in Javascript. Should be able to run in both browser and node.

## Usage:

Add the project as a submodule: `git submodule add -b v1 https://github.com/ThatCoolCoder/nosper-engine`.

Create an `Evaluator` instance and use it to evaluate expressions.

```javascript
import { Evaluator } from './nosper-engine/src/Evaluator.mjs';
var evaluator = new Evaluator();
evaluator.evaluate('5 * 2');
```

If using it in the brower, add the following tags to your html document (todo: test this):
```html
<script type="module" src="./nosper-engine/src/Token.mjs">
<script type="module" src="./nosper-engine/src/Tokeniser.mjs">
<script type="module" src="./nosper-engine/src/SyntaxTreeNodes.mjs">
<script type="module" src="./nosper-engine/src/EvaluationContext.mjs">
<script type="module" src="./nosper-engine/src/Evaluator.mjs">
```

Perhaps in future we'll use a build tool so you only have to add one.

Instructions on how to use the calculator exist but need to be migrated to this repository.
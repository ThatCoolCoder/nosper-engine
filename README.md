# nosper-engine

Mathematical engine (calculator) library written in Javascript. Should be able to run in both browser and node.

## Usage:

```javascript
import { Evaluator } from './path/to/Evaluator.mjs';
var evaluator = new Evaluator();
evaluator.evaluate('5 * 2');
```

If using it in the brower, add the following tags to your html document (todo: test this):
```html
<script type="module" src="./path/to/Token.mjs">
<script type="module" src="./path/to/Tokeniser.mjs">
<script type="module" src="./path/to/SyntaxTreeNodes.mjs">
<script type="module" src="./path/to/EvaluationContext.mjs">
<script type="module" src="./path/to/Evaluator.mjs">
```

Perhaps in future we'll use a build tool so you only have to add one.
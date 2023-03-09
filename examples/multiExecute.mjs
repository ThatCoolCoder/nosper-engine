// (run in nodejs, not browser)

import * as readline from 'readline';
import { Evaluator } from '../src/Evaluator.mjs';

var evaluator = new Evaluator();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter an equation in terms of $x: ', function (equation) {
    var compiled = evaluator.compileSingleExpression(equation);
    for (var i = 0; i < 10; i ++) {
        evaluator.context.variables.set('x', i);
        var result = evaluator.evaluateCompiledExpression(compiled);
        console.log(`Result for x = ${i} is ${result}`);
    }
    process.exit();
});

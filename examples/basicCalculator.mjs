// (run in nodejs, not browser)

import * as readline from 'readline';
import { Evaluator } from '../src/Evaluator.mjs';
import * as Errors from '../src/Errors.mjs';

var evaluator = new Evaluator(false);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Note - a recursive mainloop for this type of thing is probably not optimal. This is just a quick demo project
function mainLoop() {
    rl.question('Enter equation: ', expression => {
        try {
            console.log(evaluator.evaluate(expression));
        }
        catch (e) {
            if (e instanceof Errors.EvaluationError) {
                console.log(e.message);
            }
            else throw e;
        }
        mainLoop();
    });
}

mainLoop();
// just for dev

import * as readline from 'readline';
import tokenise from '../src/tokenise.mjs';
import * as Errors from '../src/Errors.mjs';

// var evaluator = new Evaluator(true);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainLoop() {
    rl.question('Enter equation: ', function (expression) {
        try {
            console.log(tokenise(expression));
        }
        catch (e) {
            console.log(e);
        }
        mainLoop();
    });
}

mainLoop();
// just for dev

import * as readline from 'readline';
import tokenise from '../src/tokenise.mjs';
import lex from '../src/lex.mjs';
import * as Errors from '../src/Errors.mjs';

// var evaluator = new Evaluator(true);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainLoop() {
    rl.question('Enter equation: ', function (expression) {
        try {
            var tokens = tokenise(expression);
            console.log(tokens);
            var lexemes = lex(tokens);
            console.log(lexemes);
        }
        catch (e) {
            console.log(e);
        }
        mainLoop();
    });
}

mainLoop();
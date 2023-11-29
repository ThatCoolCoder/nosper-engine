// just for dev

import * as readline from 'readline';
import tokenise from '../src/tokenise.mjs';
import lex from '../src/lex.mjs';
import parse from '../src/parse.mjs';
import { Evaluator } from '../src/Evaluator.mjs';
import * as Errors from '../src/Errors.mjs';

var evaluator = new Evaluator();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function mainLoop() {
    rl.question('Enter equation: ', function (expression) {
        try {
            var tokens = tokenise(expression);
            console.log('tokens:', tokens);
            var lexemes = lex(tokens);
            console.log('lexemes:', lexemes);
            var tree = parse(lexemes);
            console.log('tree:', tree);
            var result = evaluator.evaluateCompiledExpression(tree);
            console.log('result:', result);
        }
        catch (e) {
            console.log(e);
        }
        mainLoop();
    });
}

mainLoop();
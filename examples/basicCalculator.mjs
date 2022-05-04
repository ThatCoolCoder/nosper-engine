import { spnr } from '../src/lib/spnr.js';
import * as readline from 'readline';
import { Evaluator } from "../src/Evaluator.mjs";

var evaluator = new Evaluator();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter equation: ', function (equation) {
    console.log(evaluator.evaluate(equation));
});
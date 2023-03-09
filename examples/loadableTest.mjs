// (run in nodejs, not browser)

import { Evaluator } from '../src/Evaluator.mjs';
import { ValueGroup } from '../src/EvaluationContext.mjs';
import { Loadable } from '../src/Loadable.mjs';

var physicsLoadables = new Loadable(
    new ValueGroup({
        'g' : -9.81,
        'G' : 6.6743e-11
    }))

var evaluator = new Evaluator();

runAndCatch('$g', 'Should fail, as g is not defined:');

evaluator.load(physicsLoadables);
runAndCatch('$g', 'Should work:');

evaluator.unload(physicsLoadables);
runAndCatch('$g', 'Should fail again:');

function runAndCatch(expression, note=null) {
    if (note != null) console.log(note);
    try {
        console.log(evaluator.evaluate(expression));
    }
    catch (e) {
        console.log(e.message);
    }
}
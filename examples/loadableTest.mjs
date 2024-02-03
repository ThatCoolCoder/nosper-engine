// (run in nodejs, not browser)

import { Evaluator } from '../src/Evaluator.mjs';

const physicsLoadable = {
    name: 'Phyyyyyyysics',
    description: 'Common physics constants and calculations',
    variables: {
        'g': { value: 9.81, description: 'force of gravity on earth' }
    },
    functions: {
        'calculate_acceleration' : { args: ['f', 'm'], body: 'f / m', description: 'Calculate acceleration experienced by an object when a force is applied' }
    }
}

var evaluator = new Evaluator();

runAndCatch('g', 'Should fail as gravity isn\'t defined')

evaluator.applyLoadable(physicsLoadable);

runAndCatch('g', 'Should work');
runAndCatch('@calculate_acceleration(10, 2)', 'Should work and = 5');

evaluator.removeLoadable(physicsLoadable);
runAndCatch('g', 'Shouldn\'t work');
runAndCatch('@calculate_acceleration(10, 2)', 'Shouldn\'t work');

function runAndCatch(expression, note=null) {
    var text = '';
    if (note != null) text = `${note}: `;
    try {
        text += evaluator.evaluate(expression);
    }
    catch (e) {
        text += e.message;
    }

    console.log(text);
}
import { spnr } from './lib/spnr.mjs'

export class EvaluationContext {
    constructor() {
        this.useRadians = true;
        this.scopeStack = [new Scope()];
        this.previousAnswer = 0;
    }
}

export class Scope {
    constructor(variablesValueGroup=null, functionsValueGroup=null, includeBaseConstants=true) {
        this.variables = new ValueGroup();
        if (includeBaseConstants) this.variables.appendGroup(baseConstants);
        if (variablesValueGroup != null) this.variables.appendGroup(variablesValueGroup);

        this.functions = new ValueGroup();
        if (functionsValueGroup != null) this.functions.appendGroup(functionsValueGroup);
    }
}

const baseConstants = new ValueGroup({
    pi: spnr.PI,
    tau: spnr.PI * 2,
    e: spnr.E,
    phi: (1 + spnr.sqrt(5)) / 2, // (aka the golden ratio)
    silv: spnr.SQRT2 + 1
});

export class ValueGroup {
    // Abstraction of a dictionary for storing (potentially scoped) information such as functions and variables

    constructor(initialData={}) {
        this.data = initialData;
    }

    isDefined(valueName) {
        return this.data[valueName] != undefined;
    }

    listData() {
        return Object.keys(this.data);
    }

    get(valueName) {
        return this.data[valueName];
    }

    set(valueName, value) {
        this.data[valueName] = value;
    }

    delete(valueName) {
        // Remove a value, returns whether the item existed
        return delete this.data[valueName];
    }

    appendGroup(valueGroup) {
        // Append values from other valueGroup 
        for (var key of valueGroup.listData()) {
            this.set(key, valueGroup.get(key));
        }
    }

    removeGroup(valueGroup) {
        // Opposite of appendGroup
        for (var key of valueGroup.listData()) {
            this.delete(key);
        }
    }
}
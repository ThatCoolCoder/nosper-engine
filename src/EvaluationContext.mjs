import { spnr } from './lib/spnr.mjs'

export class EvaluationContext {
    constructor(variables=new ValueGroup(), functions=new ValueGroup()) {
        this.useRadians = true;
        this.scopeStack = [new Scope(variables, functions)];
        this.previousAnswer = 0;
    }

    get topScope() {
        return this.scopeStack[this.scopeStack.length - 1];
    }

    getVariableFromStack(variableName) {
        return this._getValueFromStack(variableName, s => s.variables);
    }

    getFunctionFromStack(functionName) {
        return this._getValueFromStack(functionName, s => s.functions);
    }

    _getValueFromStack(itemName, scopeToItem) {
        // Traverse stack from innermost level to get variable/function with a certain name
        // scopeToItem should be a function getting a valuegroup from a scope

        for (var i = this.scopeStack.length - 1; i >= 0; i --) {
            var scope = this.scopeStack[i];
            var valueGroup = scopeToItem(scope);
            if (valueGroup.isDefined(itemName)) return valueGroup.get(itemName);
        }
        return null;
    }

    isVariableDefined(variableName) {
        return this._valueDefinedOnStack(variableName, s => s.variables);
    }

    isFunctionDefined(functionName) {
        return this._valueDefinedOnStack(functionName, s => s.functions);
    }

    _valueDefinedOnStack(itemName, scopeToItem) {
        // Like _getValueFromStack but checks if it is defined on any of the levels
        return this.scopeStack.some(s => scopeToItem(s).isDefined(itemName));
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

const baseConstants = new ValueGroup({
    pi: spnr.PI,
    tau: spnr.PI * 2,
    e: spnr.E,
    phi: (1 + spnr.sqrt(5)) / 2, // (aka the golden ratio)
    silv: spnr.SQRT2 + 1
});
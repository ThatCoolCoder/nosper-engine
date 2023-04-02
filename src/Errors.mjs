export class EvaluationError extends Error {
    // Error representing error evaluating user input

    constructor(message) {
        super(message);
    }
}

export class MathSyntaxError extends EvaluationError {
    constructor() {
        super('Invalid syntax in expression');
    }
}

export class MathDomainError extends EvaluationError {
    // Thrown EG when dividing by 0
    constructor(elaboration='Unknown issue') {
        super(`Math domain error: ${elaboration}`);
    }
}

export class UndefinedVariableError extends EvaluationError {
    constructor(variableName, sameNameFunctionExists=false ) {
        var message = `Attempted use of undefined variable "${variableName}"`;
        if (sameNameFunctionExists) message += `\n(Note: there is a function with this name. Call it using an & sign: &${variableName}(args))`
        super(message);
        this.sameNameFunctionExists = sameNameFunctionExists;
    }
}

export class UndefinedFunctionError extends EvaluationError {
    constructor(functionName, sameNameVariableExists=false) {
        var message = `Attempted use of undefined function "${functionName}"`;
        if (sameNameVariableExists) message += `\n(Note: there is a variable with this name. Access it using an $ sign: $${functionName})`
        super(message);
        this.sameNameVariableExists = sameNameVariableExists;
    }
}
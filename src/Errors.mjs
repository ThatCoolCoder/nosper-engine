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
    constructor(variableName) {
        super(`Attempted use of undefined variable "${variableName}"`);
    }
}

export class UndefinedFunctionError extends EvaluationError {
    constructor(functionName) {
        super(`Attempted use of undefined function "${functionName}"`);
    }
}
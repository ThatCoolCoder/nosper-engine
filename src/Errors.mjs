export class EvaluationError extends Error {
    // Error representing error evaluating user input

    constructor(message) {
        super(message);
    }
}

export class MathSyntaxError extends EvaluationError {
    constructor(extraInfo) {
        extraInfo = extraInfo === undefined ? '' : `: ${extraInfo}`;
        super(`Invalid syntax in expression${extraInfo}`);
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

export class UnmatchedBracketError extends EvaluationError {
    constructor(wasNotClosed) {
        var innerMessage = wasNotClosed ? 'A bracket was opened but not closed'
            : 'A close bracket was found with no corresponding opening bracket';
        super(`Unmatched brackets: ${innerMessage}`);
    }
}

export class ArgumentMissingError extends EvaluationError {
    constructor(functionName, expectedArgs, providedCount) {
        var missing = expectedArgs.concat([])
        missing.splice(0, providedCount);
        super(`Missing the following argument(s) in call to function "${functionName}": ${missing.join(', ')}`);
    }
}

export class InbuiltArgumentMissingError extends EvaluationError {
    constructor(functionName, expectedCount, providedCount) {
        super(`Missing ${providedCount - expectedCount} arguments in call to function "${functionName}"`);
    }
}

export class UnexpectedArgumentError extends EvaluationError {
    constructor(functionName, expectedCount, providedCount) {
        super(`${providedCount - expectedCount} unexpected argument(s) in call to function "${functionName}"`);
    }
}

export class TypeError extends EvaluationError {
    constructor() {
        super(`TypeError - todo: give more details here`);
    }
}
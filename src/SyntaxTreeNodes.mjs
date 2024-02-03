import { spnr } from './lib/spnr.mjs'
import { LexemeSubType } from "./Lexeme.mjs";
import { Scope, FunctionInfo } from './EvaluationContext.mjs';
import { InbuiltFunctions } from './InbuiltFunctions.mjs';
import * as Errors from './Errors.mjs';

const BinaryOperator = {
    [LexemeSubType.ADD]: (a, b, ctx) => a.evaluate(ctx) + b.evaluate(ctx),
    [LexemeSubType.SUBTRACT]: (a, b, ctx) => a.evaluate(ctx) - b.evaluate(ctx),
    [LexemeSubType.MULTIPLY]: (a, b, ctx) => a.evaluate(ctx) * b.evaluate(ctx),
    [LexemeSubType.DIVIDE]: (a, b, ctx) => {
        var bValue = b.evaluate(ctx);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot divide by 0');
        return a.evaluate(ctx) / bValue;
    },
    [LexemeSubType.DIVIDE_LOW_PRECEDENCE]: (a, b, ctx) => {
        var bValue = b.evaluate(ctx);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot divide by 0');
        return a.evaluate(ctx) / bValue;
    },
    [LexemeSubType.MODULO]: (a, b, ctx) => {
        var bValue = b.evaluate(ctx);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot modulo by 0');
        return a.evaluate(ctx) % bValue;
    },
    [LexemeSubType.EXPONENTIATE]: (a, b, ctx) => {
        var aValue = a.evaluate(ctx);
        var bValue = b.evaluate(ctx);
        if (aValue == 0 && bValue == 0) throw new Errors.MathDomainError('0 to the power of 0 is undefined');
        return aValue ** bValue;
    },
    [LexemeSubType.ASSIGN]: (a, b, ctx) => {
        if (a instanceof AssignableNode) {
            var bValue = b.evaluate(ctx);
            ctx.topScope.variables.set(a.value, bValue);
            return bValue;
        }
        else if (a instanceof FunctionHeaderNode) {
            ctx.topScope.functions.set(a.name, new FunctionInfo(a.name, a.argNames, b));
            return 0;
        }
        else {
            throw new Errors.MathSyntaxError(`Cannot assign to a value of type ${a.constructor.name}`);
        }
    },
    [LexemeSubType.EXPRESSION_GROUPING]: (a, b, ctx) => {
        a.evaluate(ctx);
        return b.evaluate(ctx);
    }
}

const UnaryOperator = {
    // Prefix trig:
    [LexemeSubType.SINE]: (a, ctx) => Math.sin(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [LexemeSubType.ARC_SINE]: (a, ctx) => convertFromRadians(Math.asin(a.evaluate(ctx)), ctx.useRadians),
    [LexemeSubType.COSECANT]: (a, ctx) => 1 / Math.sin(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [LexemeSubType.COSINE]: (a, ctx) => Math.cos(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [LexemeSubType.ARC_COSINE]: (a, ctx) => convertFromRadians(Math.acos(a.evaluate(ctx)), ctx.useRadians),
    [LexemeSubType.SECANT]: (a, ctx) => 1 / Math.cos(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [LexemeSubType.TANGENT]: (a, ctx) => Math.tan(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [LexemeSubType.ARC_TANGENT]: (a, ctx) => convertFromRadians(Math.atan(a.evaluate(ctx)), ctx.useRadians),
    [LexemeSubType.COTANGENT]: (a, ctx) => 1 / Math.tan(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    
    // Prefix not trig
    [LexemeSubType.NEGATE]: (a, ctx) => -a.evaluate(ctx),
    [LexemeSubType.SQUARE_ROOT]: (a, ctx) => {
        var aValue = a.evaluate(ctx);
        if (aValue < 0) throw new Errors.MathDomainError('Attempted to find square root of negative number; this calculator does not support computation of imaginary numbers');
        return Math.sqrt(aValue);
    },
    [LexemeSubType.CUBE_ROOT]: (a, ctx) => Math.cbrt(a.evaluate(ctx)),
    [LexemeSubType.ABSOLUTE_VALUE]: (a, ctx) => Math.abs(a.evaluate(ctx)),
    [LexemeSubType.LOGARITHM]: (a, ctx) => Math.log10(a.evaluate(ctx)),
    [LexemeSubType.NATURAL_LOGARITHM]: (a, ctx) => Math.log(a.evaluate(ctx)),
    [LexemeSubType.ROUND]: (a, ctx) => Math.round(a.evaluate(ctx)),
    [LexemeSubType.FLOOR]: (a, ctx) => Math.floor(a.evaluate(ctx)),
    [LexemeSubType.CEILING]: (a, ctx) => Math.ceil(a.evaluate(ctx)),

    // Postfix
    [LexemeSubType.FACTORIAL] : (a, ctx) => {
        var aValue = a.evaluate(ctx);
        if (aValue < 0) throw new Errors.MathDomainError('Factorial function is undefined for negative numbers');
        if (aValue % 1 != 0) throw new Errors.MathDomainError('Factorial function is not supported on decimal values');

        var total = 1;
        for (var i = 2; i <= aValue; i ++) {
            total *= i;
        }
        return total;
    }
}

function convertToRadians(angle, isRadians) {
    // convert an angle to radians, regardless of whether it's radians or degrees
    if (isRadians) return angle;
    else return spnr.radians(angle)
}

function convertFromRadians(angle, toRadians) {
    if (toRadians) return angle;
    else return spnr.degrees(angle);
}

export class SyntaxTreeNode {
    evaluate(_context) {
        throw Error("SyntaxTreeNode.evalulate() was not overridden");
    }
}

export class ValueNode extends SyntaxTreeNode {
    constructor(value, subType) {
        super();
        this.value = value;
        this.subType = subType;
    }

    evaluate(context) {
        if (this.subType == LexemeSubType.NUMBER) {
            return this.value;
        }
        else if (this.subType == LexemeSubType.VARIABLE) {
            var value = context.getVariableFromStack(this.value);

            if (value == null) throw new Errors.UndefinedVariableError(this.value, context.isFunctionDefined(value));

            return value;
        }
        else if (this.subType == LexemeSubType.PREVIOUS_ANSWER) {
            return context.previousAnswer;
        }
    }
}

export class AssignableNode extends SyntaxTreeNode {
    constructor(value) {
        super();
        this.value = value;
    }
}

export class BinaryOperatorNode extends SyntaxTreeNode {
    constructor(left, right, operatorSubType) {
        super();
        this.left = left;
        this.right = right;
        this.operatorSubType = operatorSubType;
    }

    evaluate(context) {
        return BinaryOperator[this.operatorSubType](this.left, this.right, context);
    }
}

export class UnaryOperatorNode extends SyntaxTreeNode {
    constructor(operand, operatorSubType) {
        super();
        this.operand = operand;
        this.operatorSubType = operatorSubType;
    }

    evaluate(context) {
        return UnaryOperator[this.operatorSubType](this.operand, context);
    }
}

export class FunctionHeaderNode extends SyntaxTreeNode {
    constructor(name, argNames) {
        super();
        this.name = name;
        this.argNames = argNames;
    }

    evaluate(_context) {
        throw new Error('function headers should not be evaluated');
    }
}

export class FunctionCallNode extends SyntaxTreeNode {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }

    evaluate(context) {
        if (context.isFunctionDefined(this.name)) {
            var scope = new Scope();
            var functionInfo = context.getFunctionFromStack(this.name);

            if (this.args.length > functionInfo.argumentNames.length) throw new Errors.UnexpectedArgumentError(this.name, functionInfo.argumentNames.length, this.args.length);
            if (this.args.length < functionInfo.argumentNames.length) throw new Errors.ArgumentMissingError(this.name, functionInfo.argumentNames, this.args.length);

            this.args.forEach((arg, idx) => scope.variables.set(functionInfo.argumentNames[idx], arg.evaluate(context)));
            context.scopeStack.push(scope);

            var result = functionInfo.definition.evaluate(context);
            
            context.scopeStack.pop();
            return result;
        }
        else if (this.name in InbuiltFunctions) {
            var func = InbuiltFunctions[this.name];

            // Always check for too few
            if (this.args.length < func.nArgs) throw new Errors.InbuiltArgumentMissingError(this.name, func.nArgs, this.args.length);
            
            if (func.variadic) {
                return func.definition(context, this.args);
            }
            else {
                // Only check for too many if not variadic
                if (this.args.length > func.nArgs) throw new Errors.UnexpectedArgumentError(this.name, func.nArgs, this.args.length);
                return func.definition(context, ...this.args);
            }

        }
        else {
            throw new Errors.UndefinedFunctionError(this.name, context.isVariableDefined(this.name));
        }
    }
}
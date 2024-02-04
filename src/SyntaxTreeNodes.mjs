import { spnr } from './lib/spnr.mjs'
import { Types, makeNumber, makeList, safelyGetValue } from './Types.mjs';
import { Lexeme, LexemeSubType } from "./Lexeme.mjs";
import { Scope, FunctionInfo } from './EvaluationContext.mjs';
import { InbuiltFunctions } from './InbuiltFunctions.mjs';
import * as Errors from './Errors.mjs';

const BinaryOperator = {
    // Traditional operators
    [LexemeSubType.ADD]: (a, b, ctx) => {
        return makeNumber(
            safelyGetValue(a.evaluate(ctx), Types.NUMBER) +
            safelyGetValue(b.evaluate(ctx), Types.NUMBER));
    },
    [LexemeSubType.SUBTRACT]: (a, b, ctx) => {
        return makeNumber(
            safelyGetValue(a.evaluate(ctx), Types.NUMBER) -
            safelyGetValue(b.evaluate(ctx), Types.NUMBER));
    },
    [LexemeSubType.MULTIPLY]: (a, b, ctx) => {
        return makeNumber(
            safelyGetValue(a.evaluate(ctx), Types.NUMBER) *
            safelyGetValue(b.evaluate(ctx), Types.NUMBER));
    },
    [LexemeSubType.DIVIDE]: (a, b, ctx) => {
        var bValue = safelyGetValue(b.evaluate(ctx), Types.NUMBER);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot divide by 0');

        return makeNumber(safelyGetValue(a.evaluate(ctx), Types.NUMBER) / bValue);
    },
    [LexemeSubType.DIVIDE_LOW_PRECEDENCE]: (a, b, ctx) => {
        var bValue = safelyGetValue(b.evaluate(ctx), Types.NUMBER);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot divide by 0');
        return makeNumber(safelyGetValue(a.evaluate(ctx), Types.NUMBER) / bValue);
    },
    [LexemeSubType.MODULO]: (a, b, ctx) => {
        var bValue = safelyGetValue(b.evaluate(ctx), Types.NUMBER);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot modulo by 0');
        return makeNumber(safelyGetValue(a.evaluate(ctx), Types.NUMBER) % bValue);
    },
    [LexemeSubType.EXPONENTIATE]: (a, b, ctx) => {
        var aValue = safelyGetValue(a.evaluate(ctx), Types.NUMBER);
        var bValue = safelyGetValue(b.evaluate(ctx), Types.NUMBER);
        if (aValue == 0 && bValue == 0) throw new Errors.MathDomainError('0 to the power of 0 is undefined');
        return makeNumber(aValue ** bValue);
    },

    [LexemeSubType.ASSIGN]: (a, b, ctx) => {
        if (a instanceof AssignableNode) {
            var bVar = b.evaluate(ctx);
            ctx.topScope.variables.set(a.value, bVar);
            return bVar;
        }
        else if (a instanceof FunctionHeaderNode) {
            ctx.topScope.variables.set(a.name, { type: Types.FUNCTION, value: new FunctionInfo(a.argNames, b) });
            return makeNumber(0);
        }
        else {
            throw new Errors.MathSyntaxError(`Cannot assign to a value of type ${a.constructor.name}`);
        }
    },

    // Structural operators
    [LexemeSubType.EXPRESSION_GROUPING]: (a, b, ctx) => {
        a.evaluate(ctx);
        return b.evaluate(ctx);
    },
    [LexemeSubType.ITEM_GROUPING]: (a, b, ctx) => {
        var aValue = a.evaluate(ctx);
        var bValue = b.evaluate(ctx);

        var result = [];
        if (aValue.type == Types.LIST) result = result.concat(aValue.value);
        else result.push(aValue);

        if (bValue.type == Types.LIST) result = result.concat(bValue.value);
        else result.push(bValue);

        return makeList(result);
    },
    [LexemeSubType.FUNCTION_CALL]: (a, b, ctx) => {
        var args = b.evaluate(ctx);
        var trueArgs = args.type == Types.LIST ? args.value : [args];
        return performFunctionCall(a.value, trueArgs, ctx); 
    }
}

const UnaryOperator = {
    // Prefix trig:
    [LexemeSubType.SINE]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => Math.sin(convertToRadians(val, ctx.useRadians))),

    [LexemeSubType.ARC_SINE]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => convertFromRadians(Math.asin(val), ctx.useRadians)),

    [LexemeSubType.COSECANT]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => 1 / Math.sin(convertToRadians(val, ctx.useRadians))),

    [LexemeSubType.COSINE]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => Math.cos(convertToRadians(val, ctx.useRadians))),

    [LexemeSubType.ARC_COSINE]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => convertFromRadians(Math.acos(val), ctx.useRadians)),

    [LexemeSubType.SECANT]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => 1 / Math.cos(convertToRadians(val, ctx.useRadians))),

    [LexemeSubType.TANGENT]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => Math.tan(convertToRadians(val, ctx.useRadians))),

    [LexemeSubType.ARC_TANGENT]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => convertFromRadians(Math.atan(val), ctx.useRadians)),

    [LexemeSubType.COTANGENT]: (a, ctx) => dumbUnaryOperator(a, ctx,
        val => 1 / Math.tan(convertToRadians(val, ctx.useRadians))),

    
    // Prefix not trig
    [LexemeSubType.NEGATE]: (a, ctx) => dumbUnaryOperator(a, ctx, val => -val),
    [LexemeSubType.SQUARE_ROOT]: (a, ctx) => dumbUnaryOperator(a, ctx, val => {
        if (val < 0) throw new Errors.MathDomainError('Attempted to find square root of negative number; this calculator does not support computation of imaginary numbers');
        return Math.sqrt(val);
    }),
    [LexemeSubType.CUBE_ROOT]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.cbrt(val)),
    [LexemeSubType.ABSOLUTE_VALUE]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.abs(val)),
    [LexemeSubType.LOGARITHM]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.log10(val)),
    [LexemeSubType.NATURAL_LOGARITHM]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.log(val)),
    [LexemeSubType.ROUND]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.round(val)),
    [LexemeSubType.FLOOR]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.floor(val)),
    [LexemeSubType.CEILING]: (a, ctx) => dumbUnaryOperator(a, ctx, val => Math.ceil(val)),

    // Postfix
    [LexemeSubType.FACTORIAL] : (a, ctx) => dumbUnaryOperator(a, ctx, val => {
        if (val < 0) throw new Errors.MathDomainError('Factorial function is undefined for negative numbers');
        if (val % 1 != 0) throw new Errors.MathDomainError('Factorial function is not supported on decimal values');

        var total = 1;
        for (var i = 2; i <= val; i ++) {
            total *= i;
        }
        return total;
    })
}

function dumbUnaryOperator(a, ctx, operator) {
    return makeNumber(operator(safelyGetValue(a.evaluate(ctx), Types.NUMBER)));
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
            return { type: Types.NUMBER, value: this.value };
        }
        else if (this.subType == LexemeSubType.VARIABLE) {
            var foundVar = context.getVariableFromStack(this.value);

            if (foundVar == null) throw new Errors.UndefinedVariableError(this.value);

            return foundVar;
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

function performFunctionCall(funcName, args, context) {
    if (context.isVariableDefined(funcName)) {
        var scope = new Scope();
        var functionInfo = safelyGetValue(context.getVariableFromStack(funcName), Types.FUNCTION);

        if (args.length > functionInfo.argumentNames.length) throw new Errors.UnexpectedArgumentError(funcName, functionInfo.argumentNames.length, args.length);
        if (args.length < functionInfo.argumentNames.length) throw new Errors.ArgumentMissingError(funcName, functionInfo.argumentNames, args.length);

        args.forEach((arg, idx) => scope.variables.set(functionInfo.argumentNames[idx], arg));
        context.scopeStack.push(scope);

        var result = functionInfo.definition.evaluate(context);
        
        context.scopeStack.pop();
        return result;
    }
    else if (funcName in InbuiltFunctions) {
        var func = InbuiltFunctions[funcName];

        // Always check for too few
        if (args.length < func.nArgs) throw new Errors.InbuiltArgumentMissingError(funcName, func.nArgs, args.length);
        
        if (func.variadic) {
            return func.definition(context, args);
        }
        else {
            // Only check for too many if not variadic
            if (args.length > func.nArgs) throw new Errors.UnexpectedArgumentError(funcName, func.nArgs, args.length);
            return func.definition(context, ...args);
        }

    }
    else {
        throw new Errors.UndefinedFunctionError(funcName);
    }
}
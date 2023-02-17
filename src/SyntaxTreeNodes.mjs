import { spnr } from './lib/spnr.mjs'
import { TokenSubType } from "./Token.mjs";
import { ValueGroup } from './EvaluationContext.mjs';
import * as Errors from './Errors.mjs';

const BinaryOperator = {
    [TokenSubType.ADD]: (a, b, ctx) => a.evaluate(ctx) + b.evaluate(ctx),
    [TokenSubType.SUBTRACT]: (a, b, ctx) => a.evaluate(ctx) - b.evaluate(ctx),
    [TokenSubType.MULTIPLY]: (a, b, ctx) => a.evaluate(ctx) * b.evaluate(ctx),
    [TokenSubType.DIVIDE]: (a, b, ctx) => {
        var bValue = b.evaluate(ctx);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot divide by 0');
        return a.evaluate(ctx) / bValue;
    },
    [TokenSubType.MODULO]: (a, b, ctx) => {
        var bValue = b.evaluate(ctx);
        if (bValue == 0) throw new Errors.MathDomainError('Cannot modulo by 0');
        return a.evaluate(ctx) % bValue;
    },
    [TokenSubType.EXPONENTIATE]: (a, b, ctx) => {
        var aValue = a.evaluate(ctx);
        var bValue = b.evaluate(ctx);
        if (aValue == 0 && bValue == 0) throw new Errors.MathDomainError('0 to the power of 0 is undefined');
        return aValue ** bValue;
    },
    [TokenSubType.ASSIGN]: (a, b, ctx) => {
        var bValue = b.evaluate(ctx);
        ctx.variables.set(a.value, bValue);
        return bValue;
    },
    [TokenSubType.FUNCTION_ASSIGN]: (a, b, ctx) => {
        ctx.functions.set(a.value, b);
        return 0;
    }
}

const UnaryOperator = {
    // Trig:
    [TokenSubType.NEGATE]: (a, ctx) => -a.evaluate(ctx),
    [TokenSubType.SINE]: (a, ctx) => Math.sin(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [TokenSubType.ARC_SINE]: (a, ctx) => convertFromRadians(Math.asin(a.evaluate(ctx)), ctx.useRadians),
    [TokenSubType.COSINE]: (a, ctx) => Math.cos(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [TokenSubType.ARC_COSINE]: (a, ctx) => convertFromRadians(Math.acos(a.evaluate(ctx)), ctx.useRadians),
    [TokenSubType.TANGENT]: (a, ctx) => Math.tan(convertToRadians(a.evaluate(ctx), ctx.useRadians)),
    [TokenSubType.ARC_TANGENT]: (a, ctx) => convertFromRadians(Math.atan(a.evaluate(ctx)), ctx.useRadians),

    // Not trig
    [TokenSubType.SQUARE_ROOT]: (a, ctx) => {
        var aValue = a.evaluate(ctx);
        if (aValue < 0) throw new Errors.MathDomainError('Attempted to find square root of negative number; this calculator does not support computation of imaginary numbers');
        return Math.sqrt(aValue);
    },
    [TokenSubType.CUBE_ROOT]: (a, ctx) => Math.cbrt(a.evaluate(ctx)),
    [TokenSubType.ABSOLUTE_VALUE]: (a, ctx) => Math.abs(a.evaluate(ctx)),
    [TokenSubType.LOGARITHM]: (a, ctx) => Math.log10(a.evaluate(ctx)),
    [TokenSubType.NATURAL_LOGARITHM]: (a, ctx) => Math.log(a.evaluate(ctx)),
    [TokenSubType.ROUND]: (a, ctx) => Math.round(a.evaluate(ctx)),
    [TokenSubType.FLOOR]: (a, ctx) => Math.floor(a.evaluate(ctx)),
    [TokenSubType.CEILING]: (a, ctx) => Math.ceil(a.evaluate(ctx)),
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
        if (this.subType == TokenSubType.LITERAL)
        {
            return this.value;
        }
        else if (this.subType == TokenSubType.VARIABLE)
        {
            var topOfArgumentStack = context.argumentStack[context.argumentStack.length - 1];
            if (topOfArgumentStack != undefined && topOfArgumentStack.isDefined(this.value)) return topOfArgumentStack.get(this.value);
            else if (context.variables.isDefined(this.value)) return context.variables.get(this.value);
            else throw new Errors.UndefinedVariableError(this.value);
        }
        else if (this.subType == TokenSubType.PREVIOUS_ANSWER)
        {
            return context.previousAnswer;
        }
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
    constructor(right, operatorSubType) {
        super();
        this.right = right;
        this.operatorSubType = operatorSubType;
    }

    evaluate(context) {
        return UnaryOperator[this.operatorSubType](this.right, context);
    }
}

export class FunctionCallNode extends SyntaxTreeNode {
    constructor(name, args) {
        super();
        this.name = name;
        this.args = args;
    }

    evaluate(context) {
        var valueGroup = new ValueGroup();
        this.args.forEach((arg, idx) => valueGroup.set(idx, arg.evaluate(context)));
        context.argumentStack.push(valueGroup);
        if (context.functions.isDefined(this.name)) {
            var result = context.functions.get(this.name).evaluate(context);
            context.argumentStack.pop();
            return result;
        }
        else {
            throw new Errors.UndefinedFunctionError(this.name);
        }
    }
}
import { spnr } from './lib/spnr.mjs'
import { TokenSubType, TokenType } from "./Token.mjs";
import { ValueGroup } from './EvaluationContext.mjs';

const BinaryOperator = {
    [TokenSubType.ADD]: (a, b, ctx) => a.evaluate(ctx) + b.evaluate(ctx),
    [TokenSubType.SUBTRACT]: (a, b, ctx) => a.evaluate(ctx) - b.evaluate(ctx),
    [TokenSubType.MULTIPLY]: (a, b, ctx) => a.evaluate(ctx) * b.evaluate(ctx),
    [TokenSubType.DIVIDE]: (a, b, ctx) => a.evaluate(ctx) / b.evaluate(ctx),
    [TokenSubType.MODULO]: (a, b, ctx) => a.evaluate(ctx) % b.evaluate(ctx),
    [TokenSubType.EXPONENTIATE]: (a, b, ctx) => a.evaluate(ctx) ** b.evaluate(ctx),
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
    [TokenSubType.SQUARE_ROOT]: (a, ctx) => Math.sqrt(a.evaluate(ctx)),
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
    constructor(value) {
        super();
        this.value = value;
    }

    evaluate(context) {
        var topOfArgumentStack = context.argumentStack[context.argumentStack.length - 1];
        if (typeof (this.value) == 'number') return this.value;
        else if (topOfArgumentStack != undefined && topOfArgumentStack.isDefined(this.value)) return topOfArgumentStack.get(this.value);
        else if (context.variables.isDefined(this.value)) return context.variables.get(this.value);
        else return this.value; // todo: throw an error on weird value
    }
}

export class BinaryOperatorNode extends SyntaxTreeNode {
    constructor(left, right, operator) {
        super();
        this.left = left;
        this.right = right;
        this.operator = operator;
    }

    evaluate(context) {
        return BinaryOperator[this.operator](this.left, this.right, context);
    }
}

export class UnaryOperatorNode extends SyntaxTreeNode {
    constructor(right, operator) {
        super();
        this.right = right;
        this.operator = operator;
    }

    evaluate(context) {
        return UnaryOperator[this.operator](this.right, context);
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
        var result = context.functions.get(this.name).evaluate(context);
        context.argumentStack.pop();
        return result;
    }
}
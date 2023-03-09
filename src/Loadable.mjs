import { ValueGroup } from "./EvaluationContext.mjs";

export class Loadable {
    // Set of variables and functions that can be loaded at runtime

    constructor(variables=new ValueGroup(), functions=new ValueGroup()) {
        this.variables = variables;
        this.functions = functions;
    }
    
    apply(context) {
        context.variables.appendGroup(this.variables);
        context.functions.appendGroup(this.functions);
    }

    remove(context) {
        context.variables.removeGroup(this.variables);
        context.functions.removeGroup(this.functions);
    }
}
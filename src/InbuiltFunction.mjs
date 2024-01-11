import { SyntaxTreeNode } from "./SyntaxTreeNodes.mjs";

export class InbuiltFunction extends SyntaxTreeNode {
    constructor() {
        super();
    }

    evaluate(context) {
        // todo: 
        // - we need a dict somewhere listing these
        // - we need a branch somewhere between lexing and evaluating about how to know to look into that dict instead of looking into regular scope
            // - (could do like the variables did with just injecting base variables into every scope but that seems wasteful)
        // - we need to document what these are properly
    }
}
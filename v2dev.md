# V2 dev notes

misc changes to make or consider:
- make context not belong to evaluator, so you can store it as you wish
- make context include history instead of leaving this to consumer? - would allow for expansion to get nth last answer as part of an expression.
- vectors/complex numbers as native type (using `[a, b]` for definition?). Define +- */ for combining with scalars and vectors respectively, maybe special functions for dot & cross? Would require type system because if we have 2d vector, we need 3d, and you can't add them (or can you?).


# V2 dev notes

so we start with raw string. Turn this into some really dumb tokens, eg
- left bracket
- right bracket
- symbolic operator (this is a broad definition, including stuff like => for function def)
- number (sub-parser already done for this)
- 

other changes to make or consider:
- make context not belong to evaluator, so you can store it as you wish

prefix-free variables?
how would this work when it comes to determining whether abc = `a*b*c` or a single variable.
We could use a greedy system where we take the largest var name. but the trouble is that it requires knowledge of the variables that exist during the parsing stage, in order to split it. And that's not possible with the highly interpreted repl nature with calling pre-parsed stuff that we are aiming for.

Alternately we could just put them all into a single token (who knows what we will call it), and at runtime we do the . Stuff within the token is just multiplied. But that is disgusting and could have poor performance? No it too hard as what if the last bit needs to be exponented. We'll just end up making the syntax tree at execution time, dependent on the context. And I don't like that. Or maybe it's ok to get rid of the ability to precompile statements? Hybridish approach: if it's multichars it's either all singlechars multed or one long one. That actually makes sense, nobody would write `dogs * cats` as `dogscats`


prefix-free functions?
initially it might seem like it would be hard to solve as how do we tell if `f(x + 2)` is multiplying or calling, but with knowledge of whether f is func or variable it's possible. Unfortunately that's not possible in the parsing stage, and we need this knowledge while building syntax tree. eg `f(x)**2` will need exponentiation last if f is func, but exponentiation first if f is var.
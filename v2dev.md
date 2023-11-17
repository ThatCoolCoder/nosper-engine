# V2 dev notes

so we start with raw string. Turn this into some really dumb tokens, eg
- left bracket
- right bracket
- symbolic operator (this is a broad definition, including stuff like => for function def)
- number (sub-parser already done for this)
- textstuff (or should this be more fine grained at this point?)

other changes to make or consider:
- make context not belong to evaluator, so you can store it as you wish
- make context include history instead of leaving this to consumer? - would allow for expansion to get nth last answer.

#### prefix-free variables?
how would this work when it comes to determining whether abc = `a*b*c` or a single variable.
We could use a greedy system where we take the largest var name. but the trouble is that it requires knowledge of the variables that exist during the parsing stage, in order to split it. And that's not possible with the highly interpreted repl nature with also allowing pre-parsed stuff, which we are aiming for.

Alternately we could just put them all into a single token (who knows what we will call it), and at runtime we do the . Stuff within the token is just multiplied. But that is disgusting and could have poor performance? No it too hard as what if the last bit needs to be exponented. We'll just end up making the syntax tree at execution time, dependent on the context. And I don't like that. Or maybe it's ok to get rid of the ability to precompile statements? Hybridish approach: if it's multichars it's either all singlechars multed or one long one. That actually makes sense, nobody would write `dogs * cats` as `dogscats`

#### Solution?
So we take a leaf from how desmos (and mathematics) does it. We have variables normally just be a single char. We'd still need some way of detecting whether it's a set of vars of a function, but it's closer. And if you want to have more letters, you have just 1 then an underscore, in which case it will read ujntil end of identifier. This works because often your variables can be described in form noun-adjective, which can turn into n_adjective.

Examples:
- `abc` -> there is no inbuilt `a`, `ab`, or `abc` so we determine it must be variable. We take `a`, `b`, `c` in lexing/tokenising, insert implicit multiply, easy.
- `bsin2` -> there is no inbuilt `bsin` or `bsi` or ..., so we read `b` as var. then `sin` is inbuilt so we take it. then 2 is easy

this whole thing involves an overhaul of the identifier subparsers, so we need to figure out if it should be greedy or lazy. I have suspicion greedy may be better. So we need a case where one is a leading substring of another.
- `help think of this`

Extending to functions wouldn't work as well due to function names typically just being verb. So perhaps we can reuse the single letter by default, but instead allow multi-letter using a pefix char. However there are still ambiguities, eg `f(2)` is f * 2 or invoke f with 2? as noted in next para, we must be able to differentiate during parsing stage (not execution). So maybe we will have to retain prefix (at least can be less annoying to type than &)

#### prefix-free functions?
It would be hard to solve as how do we tell if `f(x + 2)` is multiplying or calling, but with knowledge of whether f is func or variable it's possible. Unfortunately that's not possible in the parsing stage, and we need this knowledge while building syntax tree. eg `f(x)**2` will need exponentiation last if f is func, but exponentiation first if f is var.
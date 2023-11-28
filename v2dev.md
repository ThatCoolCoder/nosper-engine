# V2 dev notes

so we start with raw string. Turn this into some really dumb tokens, eg
- left bracket
- right bracket
- symbolic operator (this is a broad definition, including stuff like => for function def)
- number (sub-parser already done for this)
- textstuff (or should this be more fine grained at this point?)

misc changes to make or consider:
- make context not belong to evaluator, so you can store it as you wish
- make context include history instead of leaving this to consumer? - would allow for expansion to get nth last answer as part of an expression.
- vectors/complex numbers as native type (using `[a, b]` for definition?). Define +- */ for combining with scalars and vectors respectively, maybe special functions for dot & cross? Would require type system because if we have 2d vector, we need 3d, and you can't add them (or can you?).
- multi-valued inbuilt functions (essentially treating them as not operators)

#### prefix-free variables?
how would this work when it comes to determining whether abc = `a*b*c` or a single variable.
We could use a greedy system where we take the largest var name. but the trouble is that it requires knowledge of the variables that exist during the parsing stage, in order to split it. And that's not possible with the highly interpreted repl nature with also allowing pre-parsed stuff, which we are aiming for.

Alternately we could just put them all into a single token (who knows what we will call it), and at runtime we do the . Stuff within the token is just multiplied. But that is disgusting and could have poor performance? No it too hard as what if the last bit needs to be exponented. We'll just end up making the syntax tree at execution time, dependent on the context. And I don't like that. Or maybe it's ok to get rid of the ability to precompile statements? Hybridish approach: if it's multichars it's either all singlechars multed or one long one. That actually makes sense, nobody would write `dogs * cats` as `dogscats`

#### Solution?
So we take a leaf from how desmos (and mathematics) does it. We have variables normally just be a single char. We'd still need some way of detecting whether it's a set of vars of a function, but it's closer. And if you want to have more letters, you have just 1 then an underscore, in which case it will read until end of identifier. This works because often your variables can be described in form noun-adjective, which can turn into n_adjective. We could also support an alternate form. 

Examples:
- `abc` -> there is no inbuilt `a`, `ab`, or `abc` so we determine it must be variable. We take `a`, `b`, `c` in lexing/tokenising, insert implicit multiply, easy.
- `bsin2` -> there is no inbuilt `bsin` or `bsi` or ..., so we read `b` as var. then `sin` is inbuilt so we take it. then 2 is easy

this whole thing involves an overhaul of the identifier subparsers, so we need to figure out if it should be greedy or lazy. I have suspicion greedy may be better. So we need a case where one is a leading substring of another.
- `help think of this`

Extending to functions wouldn't work as well due to function names typically just being verb. So perhaps we can reuse the single letter by default, but instead allow multi-letter using a pefix char. However there are still ambiguities, eg `f(2)` is f * 2 or invoke f with 2? as noted in next para, we must be able to differentiate during parsing stage (not execution). So maybe we will have to retain prefix (at least can be less annoying to type than &)

#### prefix-free function calling?
It would be hard to solve as how do we tell if `f(x + 2)` is multiplying or calling, but with knowledge of whether f is func or variable it's possible. Unfortunately that's not possible in the parsing stage, and we need this knowledge while building syntax tree. eg `f(x)**2` will need exponentiation last if f is func, but exponentiation first if f is var. Actually, if we have multiple arguments it is theoretically possible to determine, because of the comma (albeit with a bit of forward peeking), but we still need single arg functions to be easy to call. Leaving a trailing comma is not an acceptable solution: `f(a,)`

Possible call syntax:
- &f(a, b, c)       (current)
- \f(a, b, c)       (tex-style)
- $f(a, b, c)
- @f(a, b, c)
- #f(a, b, c)
- f(a, b, c)

#### function definition overhaul

The current system is quite poor, using numbered args sucks. Points to discuss are whether we use `=>` or `=`, whether to have a `def`-like keyword, then finally what that keyword should be
- def f(a, b, c) => a + b + c	    This and the one below are easiest to implement
- f(a, b, c) => a + b + c		    Easiest to implement as it uses separate notation from vars
- f(a, b, c) = a + b + c		    Most mathematically pure but harder to do
- fn f(a, b, c) => a + b + c

#### Possible parse system

raw string into:
- left bracket
- right bracket
- symbolic operator (include separator here?)
- number
- text

For a simple language form it may be sufficient to parse directly into the meanings of these, and straight away separate text into var/. But it may be beneficial to leave room to grow, for instance if we want to make there be more marked differences in parsing between function headers/bodies, which would warrant first cleaning up the string and then going through and assignming

into:
- 

final:
- ast with nodes very similar to current ones:
    - expression
    - binary operator {type, left: node, right: node}
        - add, sub etc
        - assign
        - comparisons, returning 0 or 1 for binary logic
        - function assign {function header, value: node}
    - unary operator {type, operand: node}
        - I think we can use only one for post/pre since at this point we're describing operations separate from grammar
    - ternary operator {type, left, center, right}?
        - useful to add a proper ternary if instead of the half baked if and if not that you add together
    - function header (as in the info about the fn) {name, vars}
    - value
        - number
        - variable
        - previous answer

then we can do checks based on node type to make sure is valid. Will require a method to easily get (grand+)children of a node
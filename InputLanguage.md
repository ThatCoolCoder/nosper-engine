# Nosper Engine input language

This document details how to write expressions for Nosper Engine. It is intended to be understandable even by those who are not programmers, so if something is confusing please create a github issue to discuss it.

## Basic usage

Simple calculations are simple to write, for instance `2 + 2`. The engine respects order of operations and brackets, so `2 + 3 * 4 = 14` and `3 * (1 + 2) = 9`. Below is the list of basic operators: 
```
Addition:              +
Subtraction/negation:  -
Multiplication:        * or x
Division:              /
Exponentiation:        ** or ^
```

Here are some more example expressions:
```
sin 1           Calc sine of 1
sin(1 + 2)      Calc sine of complex expression
sqrt 2          Square root of 2
5pi             5 times pi
```

You can input numbers in a variety of ways:
```
10
0.5
.5      = 0.5
5e3     = 5000
5e-1    = 0.5
```

Whitespace is largely optional and some functions have abbreviations:
```
2+3*4       Same as 2 + 3 * 4
sin15       Same as sin(15)
q2          Same as sqrt 2
```

Multiplication signs can be ommitted in many situations:
```
10 (8 + 2)          = 100
(1 + 2)(2 + 3)      = 15
sqrt(16)2pi         = 39.985...
```

## All features

### Multiple expressions

Multiple expressions can be evaluated at once by separating them with semicolons. The overall expression evaluates to the last one returned. For instance, `a = 2; a + 1` evaluates to 3.

### Memory

#### Previous answer

The value of the previous answer can be accessed using `ans`, eg `ans * 2`.

#### Variables

Variables are assigned like `a = 2` and can then be used like `a * 2`.

There are two types of variable: single and multi character. By default a string of text is interpreted as single variables, but the presence of an underscore signifies that the rest of the text is part of a multi-character variable. If there's a letter before the underscore, this is taken as the first letter of the multi character variable. If you have experience with latex typesetting, it is similar to that. This system may seem complicated at first, but it is useful as it allows two use cases:
- quick typing and implicit multiplication of single letter values (similar to how mathematicians would write simpler expressions on paper).
- detailed variable names as are used in more complex 

See below for examples of how different text is parsed as variables:
```
a                   the single variable a
abc                 multiplication of three variables a, b and c; a * b * c
m_cow               the single variable m_cow
2m_cow              2 * m_cow
m_cow2              the single variable m_cow2
_my_fav_number      the single variable _my_fav_number
am_cow              a * m_cow
am_cow b            a * m_cow * b
```

#### Custom functions

Custom functions can be defined like `def multiply_numbers(a, b) = a * b`, then called like `@multiply_numbers(2, 3)`. Any expression can be given to a function as an argument, so `@multiply_numbers(1 + 2, m_cow)` or even `@multiply_numbers(@multiply_numbers(2, 3), 3)` are also valid expressions. To create a function with no arguments just do `def myfunc() = a + 2` - this example utilises a global variable instead of having a value passed in. Note that it's not possible to mutate a global variable from within a function, assignment of a variable always assigns to the current scope.

Single-argument functions can be called without parenthesis (the @ sign is actually the operator that signifies invocation), eg `@double 2`.

Functions can call other functions. Each call has its own scope, so arguments passed to it and variables defined inside do not leak out. Multiple-expression functions can be created using parentheses and `;`, eg `def f(a, b) = (_intermediate = a * b; _intermediate + 1)`. (the parentheses are required as `;` otherwise has lower precedence than `=`)

### Data types

There are currently three data types, although more will likely be added in future. Attempting to perform operations on invalid types will result in an `Errors.TypeError`. These types are exported as `Types` by `Types.mjs`.

### Number

Just a number. Can do arithmetic on it. Currently it's a floating point number, in future this might change to being some sort of decimal or fractional representation.

### List

Lists are collections of other values, which do not all need to be of the same type. They are created by the comma operator, and normally surrounded by brackets to ensure correct precedence. Eg `a = (1, 2)`. Lists are currently quite messy and limited, eg at this stage it's not possible to call a function with a list as an argument due to functions unpacking a list that they receive into multiple arguments.

### Function

Functions are just another variable type in nosper - `def` sets a variable to the function value, and the `@` symbol is actually an operator that invokes the function. This means that you can alias functions just by assigning variables, so `def myfunc(a, b) = a + b; _alias = _myfunc; @alias(2, 3)` evaluates to 5. Observe that leading underscores are required when using multi-letter functions as variables. As `def` and `@` are the most common ways to interact with functions, these automatically recognise multi-letter functions and add the leading underscore, however it's not possible for this detection to work when using variables.

#### Unassigning

There's currently no way to unassign variables - make a github issue if you want this functionality.

## Reference

### Inbuilt constants

These "constants" are defined by the engine, however at this stage they are just predefined variables so they can be overridden just by redefinition. If this behaviour is changed it will likely bump the engine to v3. Note that the constants are redefined within each scope, so if the root scope changes the value of pi, calculations happening within functions won't be affected.
```
Description             name    value

Pi                      pi      3.141...
Tau                     tau     6.283...
Phi (Golden ratio)      phi     1.618...
Silver ratio            silv    2.414...
```

### Operators

```
Binary (regular)
    Addition:                   +
    Subtraction                 -   (also performs negation if it's not between two numbers)
    Multiplication:             *
    Division:                   /
    Division - low precedence:  //  (evaluated after everything except assignments,
                                     useful for constructing fractions)
    Modulo:                     %
    Exponentiation:             ** or ^

Prefix (goes before the value, shown with example values)
    Trig
        Sin         sin 1
        Arc sine    asin -0.2
        Cos         cos 1
        Arc cos     acos (1/2)
        Tan         tan (3/4 pi)
        Arc tan     atan 1
        Cosecant    csc 5
        Secant      sec 1
        Cotangent   cot 2

    Other
        Negate                  -2
        Square root             sqrt2 or q2
        Cube root               cbrt2
        Absolute value          abs (-2)
        Base 10 logarithm       log 120
        Natural logarithm       ln 35
        Round to whole number   round 1.2
        Round down/floor        floor 1.9
        Round up/ceiling        ceil 2.1

Postfix (goes after the value, shown with example usage)
    Factorial   4!
```

### Inbuilt functions

For some niche tasks that are not important enough to give dedicated syntax, inbuilt functions have been created. These look like custom functions but can achieve greater functionality as they are directly implemented in Javascript.

```
@ifelse(_condition, _trueVal, _falseVal)
    If the value of _condition is zero, it will evaluate to _falseVal, otherwise _trueVal. Short circuiting.
```
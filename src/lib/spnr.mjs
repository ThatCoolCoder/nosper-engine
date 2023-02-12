/*@license

spnr.js v1.8.0

MIT License

Copyright (c) 2023 That-Cool-Coder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// inserted at start of compiled spnr (when compiled to .mjs)

var spnrAsMjs = true;

// Setup spnr instance

var spnrInBrowser = typeof window !== 'undefined';
var spnrAlreadyDefined = spnrAsMjs
    ? false
    : spnrInBrowser
        ? window.spnr !== undefined
        : false;

if (spnrAlreadyDefined) {

    // If spnr is already defined, try to use the internal warner to say so
    // In the case that spnr refers to something other than this lib,
    // ...just use normal console.warn
    const message = 'An instance of spnr.js is already running';
    try {
        spnr.internalWarn(message);
    }
    catch {
        console.warn(message);
    }
}
else {
    /** Namespace containing all of spnr.js
     * @namespace
     */
    var spnr = {}; // Create an object to be the basis of spnr
    spnr.VERSION = 'v1.8.0';
    spnr.consoleLogHeader = '  🔧🔧 ';
    spnr.consoleLogStyling = 'background-color: #9cc8ff; display: block';
    if (spnrInBrowser && spnrAsMjs) window.spnr = spnr; // Make it global

    // Make a 'hello' message
    console.log(`%c  \n${spnr.consoleLogHeader} spnr.js ${spnr.VERSION}  \n  `,
        spnr.consoleLogStyling);

    // Load the consts & functions from math
    Object.getOwnPropertyNames(Math).forEach(key => {
        spnr[key] = Math[key];
    });
}

/** Log to console with spnr.js styling
 * @param {string} message
*/
spnr.internalLog = function(message) {
    var fullMessage = '%c' + spnr.consoleLogHeader + message;
    console.log(fullMessage, spnr.consoleLogStyling);
}

/** Warn to console with spnr.js styling 
 * @param {string} message
*/
spnr.internalWarn = function(message) {
    var fullMessage = `${spnr.consoleLogHeader} spnr.js warning:\n  ${message}`;
    console.warn(fullMessage);
}

/**
 * I'm not really sure exactly what this does, kept for legacy support.
 * @returns {string}
 */
spnr.uniqueId = function() {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + spnr.random().toString(36).substr(2, 9);
}

/**
 * Generate a random true or false value
 * @returns {boolean}
 */
spnr.randBoolean = function() {
    // Randomly return true or false

    return spnr.random() > 0.5;
}

/**
 * Do nothing. Was created before I realised you can just do void(0). Only kept for backwards compatibility
 */
spnr.doNothing = function() {
    // do nothing
}

/**
 * Like a for loop mixed with a foreach.
 * @param {number} n - loop from 0 to n - 1.
 * @param {Function} func - function to run each loop cycle with n as a parameter.
 */
spnr.doNTimes = function(n, func) {
    for (var i = 0; i < n; i ++) {
        func(i);
    }
}

/**
 * spnr.js string operations
 * @namespace
 */
spnr.str = {};

/**
 * Array of letters in the lowercase ASCII alphabet
 * @type {string[]}
 */
spnr.str.lowerAlphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
/**
 * Array of letters in the uppercase ASCII alphabet
 * @type {string[]}
 */
spnr.str.upperAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
/**
 * Array of letters in the lowercase and uppercase ASCII alphabet
 * @type {string[]}
 */
spnr.str.alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
/**
 * Array of digits 0-9 (as strings, not numbers)
 * @type {string[]}
 */
spnr.str.digits = '0123456789'.split('');
/**
 * Array of punctuations in ASCII
 * @type {string[]}
 */
spnr.str.symbols = '~`!@#$%^&*()-_,=+[{]}\\|;:\",<.>/?'.split('');

/**
 * Create a random string from a certain set of letters
 * @param {number} length - length of the string to create
 * @param {string[]} charsToUse - characters to use to create the string
 * @returns {string}
 */
spnr.str.randomFromArray = function(length=1, charsToUse=[]) {
    // Create a random string using the chars in charsToUse
    
    var result = '';
    for (var i = 0; i < length; i ++) {
        result += spnr.arr.choose(charsToUse);
    }
    return result;
}

/**
 * Create a random string.
 * @param {number} length 
 * @param {boolean} lowercaseAllowed - whether lowercase letters will be included in produced string
 * @param {boolean} uppercaseAllowed - whether uppercase letters will be included in produced string
 * @param {boolean} digitsAllowed - whether digits will be included in produced string
 * @param {boolean} symbolsAllowed - whether symbols will be included in produced string
 * @returns {string}
 */
spnr.str.random = function(length=1, lowercaseAllowed=true, uppercaseAllowed=true,
    digitsAllowed=true, symbolsAllowed=true) {
    
    var charsToUse = [];
    if (lowercaseAllowed) charsToUse = charsToUse.concat(spnr.str.lowerAlphabet);
    if (uppercaseAllowed) charsToUse = charsToUse.concat(spnr.str.upperAlphabet);
    if (digitsAllowed) charsToUse = charsToUse.concat(spnr.str.digits);
    if (symbolsAllowed) charsToUse = charsToUse.concat(spnr.str.symbols);

    return spnr.str.randomFromArray(length, charsToUse);
}

/**
 * Create a random string using letters only
 * @param {number} length 
 * @param {boolean} lowercaseAllowed - whether lower case letters will be included in produced string
 * @param {boolean} uppercaseAllowed - whether upper case letters will be included in produced string
 * @returns {string}
 */
spnr.str.randomLetters = function(length=1, lowercaseAllowed=true, uppercaseAllowed=true) { 
    var charsToUse = spnr.str.symbols;
    if (lowercaseAllowed) charsToUse = charsToUse.concat(spnr.str.lowerAlphabet);
    if (uppercaseAllowed) charsToUse = charsToUse.concat(spnr.str.upperAlphabet);
    
    return spnr.str.randomFromArray(length, charsToUse);
}

/**
 * Generate a string of random symbols and optionally numbers
 * @param {number} length 
 * @param {boolean} digitsAllowed - whether to include digits in the produced string 
 * @returns {string}
 */
spnr.str.randomSymbols = function(length=1, digitsAllowed=false) { 
    var charsToUse = spnr.str.symbols;
    if (digitsAllowed) charsToUse = charsToUse.concat(spnr.str.digits);
    
    return spnr.str.randomFromArray(length, charsToUse);
}

/**
 * Generate a random string of digits.
 * @param {number} length 
 * @returns {string}
 */
spnr.str.randomDigits = function(length=1) {
    return spnr.str.randomFromArray(length, spnr.str.digits);
}

/**
 * Break ("safen") HTML tags so that they won't do bad things when displayed in the DOM.
 * Adds invisible characters after all opening tags.
 * @param {string} str - string containing tags to break
 * @returns {string}
 */
spnr.str.breakHtmlTags = function(str) {
    return str.replace(/</g, '<\u200c');
}

/**
 * Repeat a string a certain amount of times. Was created before I know what ''.repeat was. Only kept for backwards compabitility
 * @param {string} str - string to repeat
 * @param {number} amount - amount of times to repeat something
 * @returns {string}
 */
spnr.str.mult = function(str, amount) {
    // return str repeated amount times
    var result = '';
    for (var i = 0; i < amount; i ++) {
        result += str;
    }
    return result;
}

/**
 * Replace all instances of a substring in a string. If String.replaceAll is found it will use that. Otherwise it will use a workaround.
 * @param {string} str - string to replace in.
 * @param {string|RegExp} pattern - string or regex to find bits to replace.
 * @param {string} replacement - string to insert into issues.
 * @returns {string} 
 */
spnr.str.replaceAll = function(str, pattern, replacement='') {
    // If string.replaceAll is supported, use it
    if (typeof str.replaceAll == 'function') {
        return str.replaceAll(pattern, replacement);
    }
    // Else do it the lazy way
    else {
        while (str.includes(pattern)) {
            str = str.replace(pattern, replacement);
        }
        return str;
    }
}

/**
 * Return a shuffled copy of the string
 * @param {string} str 
 * @returns {string}
 */
spnr.str.shuffle = function(str) {
    return spnr.arr.shuffle(str.split('')).join('');
}


/**
 * 180 divided by pi. Used to convert between degrees and radians (but don't use directly, there are functions for that)
 */
spnr._180DIVPI = 180 / spnr.PI; // speeds up degrees -> radians and vice versa

/**
 * Round a number to an amount of decimal places
 * @param {number} num - Number to round
 * @param {number} [decimalPlaces=0] - Amount of decimal places to round to. If it is zero, rounds to whole number. If it is negative, rounds to a power of 10.
 * @returns {number} rounded number
 */
spnr.round = function(num, decimalPlaces=0) {
    var numToRound = num * 10**decimalPlaces;
    return Math.round(numToRound) / 10**decimalPlaces;
}

/**
 * Floor (round down) a number to an amount of decimal places
 * @param {number} num - Number to floor
 * @param {number} [decimalPlaces=0] - Amount of decimal places to floor to. If it is zero, floors to whole number. If it is negative, floors to a power of 10.
 * @returns {number} floored number
 */
spnr.floor = function(num, decimalPlaces=0) {
    var numToRound = num * 10**decimalPlaces;
    return Math.floor(numToRound) / 10**decimalPlaces;
}

/**
 * Round up a number to an amount of decimal places
 * @param {number} num - Number to round up
 * @param {number} [decimalPlaces=0] - Amount of decimal places to round to. If it is zero, rounds up to whole number. If it is negative, rounds up to a power of 10.
 * @returns {number} rounded number
 */
spnr.ceiling = function(num, decimalPlaces=0) {
    var numToRound = num * 10**decimalPlaces;
    return Math.ceil(numToRound) / 10**decimalPlaces;
}

/**
 * Generate a random float in a given range
 * @param {number} min - lower bound of the range (inclusive)
 * @param {number} max - upper bound of the range (exclusive)
 * @returns {number}
 */
spnr.randflt = function(min, max) {
    var diff = max - min;
    return Math.random() * diff + min;
}

/**
 * Generate a random integer in a given range
 * @param {number} min - lower bound of the range (inclusive)
 * @param {number} max - upper bound of the range (exclusive)
 * @returns {number}
 */
spnr.randint = function(min, max) {
    return Math.floor(spnr.randflt(min, max));
}

/**
 * Calculate sigmoid of a value
 * @param {number} x 
 * @returns {number}
 */
spnr.sigmoid = function(x) {
    // Do sigmoid
    return 1 / (1 + Math.exp(-x)); // f(x) = 1 / (1 + e^(-x))
}

/**
 * Calculate inverse sigmoid of a value
 * @param {number} x 
 * @returns {number}
 */
spnr.invSigmoid = function(x) {
    // Do inverse sigmoid
    return spnr.sigmoid(x) * (1 - spnr.sigmoid(x)); // f'(x) = f(x) * (1 - f(x))
}

/**
 * Convert an angle in radians to degrees
 * @param {number} radians - value to convert
 * @returns {number}
 */
spnr.degrees = function(radians) {
    return radians * spnr._180DIVPI;
}

/**
 * Convert an angle in degrees to radians
 * @param {number} degrees - value to convert
 * @returns {number}
 */
spnr.radians = function(degrees) {
    return degrees / spnr._180DIVPI;
}

/**
 * Calculate the mean of two numbers
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
spnr.mean = function(a, b) {
    return (a + b) / 2;
}

/**
 * Constraint a value to be no lesser than min and no greater than max
 * @param {number} num 
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
spnr.constrain = function(num, min, max) {
    // Constrain num between min and max

    return Math.max(min, Math.min(num, max))
}

/**
 * Converge a number one step towards a target by taking a step of a certain increment.
 * If num > target, decresases num. If num < target, increases num
 * If the distance to target is less than that increment, returns the target (avoids overshooting)
 * @param {number} num 
 * @param {number} target 
 * @param {number} maxIncrement - maximum value to increment the number by each step.
 * @returns {number} stepped value
 */
spnr.convergeValue = function(num, target, maxIncrement) {
    var delta = target - num;
    if (spnr.abs(delta) > spnr.abs(maxIncrement)) {
        return num + spnr.sign(delta) * spnr.abs(maxIncrement);
    }
    else return num;
}

/**
 * Does not work, do not use
 */
spnr.wrapAround = function(num, min, max) {
    // Make num wrap around from min to max and max to min if it goes over
    // Not complete !FIXME! if num < min is not correct! and it's also wrong if num > max

    var diff = max - min;
    if (num > max) num = num % diff + min;
    if (num < min) num = max;
    return num;
}

/**
 * Map a number from one range to another.
 * @param {number} num - number to map
 * @param {number} oldMin - minimum of old range
 * @param {number} oldMax - maximum of old range
 * @param {number} newMin - minimum of new range
 * @param {number} newMax - maximum of new range
 * @returns {number} the mapped number
 */
spnr.mapNum = function(num, oldMin, oldMax, newMin, newMax) {
    var slope = (newMax -  newMin) / (oldMax - oldMin);
    var output = newMin + slope * (num - oldMin);
    return output;
}

/** spnr.js DOM (html) functions
 * @namespace
 */
spnr.dom = {};

spnr.dom.logPara = undefined;

/**
 * A shortening of document.getElementById().
 * @param {string} id - id of element to get
 * @returns {Element|null} element with that id. If element is not found, returns null;
 */
spnr.dom.id = function(id) {
    return document.getElementById(id);
}

/**
 * Get the document viewport width
 * @returns {number} width of the viewport
 */
spnr.dom.viewportWidth = function() {
    return Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
}

/**
 * Get the document viewport height
 * @returns {number} height of the viewport
 */
spnr.dom.viewportHeight = function() { 
    return Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}

/**
 * Get the document viewport size as a spnr.js vector
 * @returns {spnr.Vector} size of the viewport
 */
spnr.dom.viewportSize = function() {
    return spnr.v(spnr.dom.viewportWidth(), spnr.dom.viewportHeight());
}

/**
 * Get the size of a HTML element as a vector.
 * @param {HTMLElement} element - element to measure
 * @returns {spnr.Vector}
 */
spnr.dom.elementSize = function(element) {
    return spnr.v(element.clientWidth, element.clientHeight);
}

/**
 * Clear the log paragraph
 */
spnr.dom.clearLogPara = function() {
    if (spnr.dom.logPara !== undefined) {
        spnr.dom.logPara.innerText = '';
    }
}

/**
 * Log data to the DOM. Useful for situations where data is being created fast and it would be unreadable in the console, such as game physics.
 * @param {any} data - data to log
 * @param {string} [label=No Label] label - optional label for the log.
 */
spnr.dom.logToPara = function(data, label='No label') {
    if (spnr.dom.logPara === undefined) {
        spnr.dom.logPara = document.createElement('p');
        document.body.appendChild(spnr.dom.logPara);
    }
    spnr.dom.logPara.innerText += `${label} : ${data}\n`;
}

/**
 * Delete an element by its id. If element is not found, does nothing.
 * @param {string} id - id of element to remove. 
 */
spnr.dom.delete = function(id) {
    var elem = spnr.dom.id(id);
    if (elem != undefined) {
        elem.remove();
    }
}

/**
 * spnr.js array operations
 * @namespace
 */
spnr.arr = {};

/**
 * Remove first instance of item from array. If item is not found, writes warning in console.
 * @param {Array} array - array to edit
 * @param {any} item - item to search for and remove
 */
spnr.arr.removeItem = function(array, item) {
    var index = array.indexOf(item);
    if (index == -1) {
        spnr.internalWarn(`Could not remove item ${item} from array as it is not in the array`);
    }
    else {
        spnr.arr.removeIndex(array, index);
    }
}

/**
 * Remove item at index from array
 * @param {Array} array - array to edit
 * @param {number} index - index of item to remove
 */
spnr.arr.removeIndex = function(array, index) {
    if (index < 0 || index >= array.length) {
        spnr.internalWarn(`Could not remove item at ${index} from array as the index is out of bounds`);
    }
    else {
        array.splice(index, 1);
    }
}

/**
 * Find the index of the highest item in the array. If there are multiple equal highest items, returns the index of the last one.
 * @param {number[]} array - array to search in
 * @return {number} the index of the highest item.
 */
spnr.arr.highestIndex = function(array=[]) {
    var highestIdx = null;
    var highestItem = 0;
    array.forEach((item, i) => {
        if (item >= highestItem) {
            highestItem = item;
            highestIdx = i;
        }
    });
    return highestIdx;
}

/**
 * Find the index of the lowest item in the array. If there are multiple equal lowest items, returns the index of the last one.
 * @param {number[]} array - array to search in
 * @return {number} the index of the lowest item.
 */
spnr.arr.lowestIndex = function(array=[]) {
    var lowestIdx = null;
    var lowestItem = 0;
    array.forEach((item, i) => {
        if (item <= lowestItem) {
            lowestItem = item;
            lowestIdx = i;
        }
    });
    return lowestIdx;
}

/**
 * Choose a random item from the array
 * @param {Array} array - array to choose from
 * @returns {any} a random item
 */
spnr.arr.choose = function(array=[]) {
    return array[spnr.randint(0, array.length)];
}

/**
 * Get the sum of the items in the array
 * @param {number[]} array - array to sum
 * @returns {number} sum of the values in the array
 */
spnr.arr.sum = function(array=[]) {
    var sum = array.reduce(function(a, b){
        return a + b;
    }, 0);
    return sum;
}

/**
 * Get the product (multiplied values) of the items in the array
 * @param {number[]} array - array to multiply
 * @returns {number} product of the values in the array
 */
spnr.arr.product = function(array=[]) {
    var product = array.reduce(function(a, b){
        return a * b;
    }, 1);
    return product;
}

/**
 * Get the mean (average) of the items in the array
 * @param {number[]} array - array to average
 * @returns {number} mean of the values in the array
 */
spnr.arr.mean = function(array=[]) {
    var sum = spnr.arr.sum(array);
    var mean = sum / array.length;
    return mean;
}

/**
 * Get the median (middle value) of the array. If the array has even length, return the mean of the two central elements.
 * @param {number[]} array - array to average
 * @returns {number} median of the values in the array
 */
spnr.arr.median = function(array=[]) {
    // If it's even find the two middle numbers and find their mean
    if (array.length % 2 == 0) {
        var justBelowMiddle = array[array.length / 2 - 1];
        var justOverMiddle = array[array.length / 2];
        return spnr.mean(justBelowMiddle, justOverMiddle);
    }
    // If it's odd find the middle index
    else {
        var middleIndex = array.length / 2 - 0.5;
        return array[middleIndex];
    }
}

/**
 * Get the mode (most common value(s)) of the array. Returns an array of most common values, in case there are multiple modal values
 * @param {any[]} array - array to average
 * @returns {any[]} array of the most common items. If input array is empty, an empty array
 */
spnr.arr.mode = function(array=[]) {
    
    // Because objects can't be used as object keys,
    // use two arrays to emulate an object
    var commonalityKeys = [];
    var commonalityValues = [];
    for (var item of array) {
        if (commonalityKeys.includes(item)) {
            commonalityValues[commonalityKeys.indexOf(item)] ++;
        }
        else {
            commonalityKeys.push(item);
            commonalityValues.push(1);
        }
    }

    var highestCommonalityItems = [];
    var highestCommonality = 0;
    for (var idx = 0; idx < commonalityValues.length; idx ++) {
        var commonalityValue = commonalityValues[idx];
        if (commonalityValue > highestCommonality) {
            highestCommonality = commonalityValue;
            highestCommonalityItems = [];
        }
        if (commonalityValue == highestCommonality) {
            highestCommonalityItems.push(commonalityKeys[idx]);
        }
    }
    return highestCommonalityItems;
}

/**
 * Shuffle an array in place using the Kunth-Fisher-Yates algorithm
 * @param {any[]} array 
 */
spnr.arr.shuffleInPlace = function(array) {
    var newIndices = [];
    for (var i = 0; i < array.length; i ++) {
        newIndices[i] = spnr.randint(0, array.length);
    }
    for (var i = 0; i < array.length; i ++) {
        var swapValue = array[i];
        array[i] = array[newIndices[i]];
        array[newIndices[i]] = swapValue;
    }
}

/**
 * Return a shuffled copy of an array.
 * @param {any[]} array - array to shuffle
 * @returns {any[]}
 */
spnr.arr.shuffle = function(array) {
    var shuffledArray = [].concat(array);
    spnr.arr.shuffleInPlace(shuffledArray);
    return shuffledArray;
}

/**
 * spnr.js Object operations
 * @namespace
 */
spnr.obj = {};

/**
 * Get an array of the keys of an object.
 * @param {Object} obj
 * @returns {string[]} keys of the object
 */
spnr.obj.keys = function(obj) {
    return Object.keys(obj);
}

/**
 * Get an array of the values of an object.
 * @param {Object} obj
 * @returns {string[]} values of the object
 */
spnr.obj.values = function(obj) {
    return Object.values(obj);
}

/**
 * Change the values of an object without changing the keys.
 * Assumes that the length of the values is greater than or equal to the amount of keys in the object.
 * @param {Object} obj
 * @param {any[]} values - values to set the keys to 
 */
spnr.obj.setValues = function(obj, values) {
    // change the values of an object without changing the keys
    // assumes that keys and values are same length, etc
    var keys = spnr.obj.keys(obj);
    keys.forEach((key, i) => {
        obj[key] = values[i];
    });
}

/**
 * Shallow copy an object (copy one level but don't deep copy properties).
 * @param {Object} obj - object to copy
 * @returns {Object}
 */
spnr.obj.oneLevelCopy = function(obj) {
    var newObj = {};
    var keys = spnr.obj.keys(obj);
    keys.forEach(key => {
        newObj[key] = obj[key];
    });
    return newObj;
}

/**
 * Whether the object has any keys
 * @param {object} obj 
 * @returns {boolean}
 */
spnr.obj.isEmpty = function(obj) {
    if (! obj) return true;
    return Object.keys(obj).length == 0;
}

/**
 * Create an enum-like object from another object.
 * Useful because you might be too lazy to have distinct keys on the original object so you create it like:
 * ```
 * {a : 0, b : 0, c : 0}
 * ```
 * and this function returns:
 * ```
 * {a : 1, b : 1, c : 1} or {a : 'a', b : 'b', c : 'c'}
 * ```
 * Takes an object as an input and not a string of keys because that way intellisense can tell there's an object there
 * @param {object} obj - object to convert to an enum (is modified)
 * @param {boolean} stringKeys - whether the keys of the enum should be numbers (0, 1, 2) or strings (the keys of the object)
 */
spnr.obj.toEnum = function(obj, stringKeys=false) {
    var counter = 0;
    for (var key of Object.keys(obj)) {
        obj[key] = stringKeys ? key : counter;
        counter ++;
    }
}

// You'll notice that a lot of the functions in this file could use the other ones
// But this carries a severe speed penalty, so I've put things inline if that speeds it up
// Vector operations are often the slowest thing in an application,
// so making them fast is critical

/**
 * Three-dimensional vector class. Not a real class in that you can't instantiate one directly - instead use spnr.v(x, y, z).
 * @typedef {Object} Vector
 * @memberof spnr
 * @property {number} x - The x component of the vector
 * @property {number} y - The y component of the vector
 * @property {number} z - The z component of the vector
 */


/**
 * Create a new spnr.js vector
 * @namespace
 * @param {number} x
 * @param {number} y
 * @param {number} z
 * @returns {spnr.Vector}
 */
spnr.v = function(x, y, z=0) {
    // simple and (hopefully) fast
    return {x : x, y : y, z : z};
}

/**
 * Set all of the axis of the vector to zero. Modifies the vector.
 * @param {spnr.Vector} v 
 */
spnr.v.makeZero = function(v) {
    v.x = 0;
    v.y = 0;
    v.z = 0;
}

/**
 * Create a new vector with random values inside a certain range. The x val of the new vector will be between min.x and max.x, the same applies for the other axes.
 * @param {spnr.Vector} min - vector containing minimum values for each dimension
 * @param {spnr.Vector} max - vector containing maximum values for each dimension
 * @param {boolean} [floatsAllowed=true] - whether values of the vector can be floats.
 * @returns {spnr.Vector}
 */
spnr.v.random = function(min, max, floatsAllowed=true) {
    if (floatsAllowed) {
        return new spnr.v(spnr.randflt(min.x, max.x),
            spnr.randflt(min.y, max.y),
            spnr.randflt(min.z, max.z));
    }
    else {
        return new spnr.v(spnr.randint(min.x, max.x),
            spnr.randint(min.y, max.y),
            spnr.randint(min.z, max.z));
    }
}

/**
 * Deep copy the vector
 * @param {spnr.Vector} v - vector to copy
 * @returns {spnr.Vector}
 */
spnr.v.copy = function(v) {
    return spnr.v(v.x, v.y, v.z);
}

/**
 * Format a vector as a string, mainly for debugging
 * @param {spnr.Vector} v - vector to format
 * @param {boolean} [verbose=false]
 * @returns {string}
 */
spnr.v.prettyPrint = function(v, verbose=false) {
    if (verbose) {
        return `spnr.v: {x : ${v.x}, y : ${v.y}, z : ${v.z}}`;
    }
    else {
        return `{x:${v.x},y:${v.y},z:${v.z}}`;
    }
}
/**
 * Whether the values of two vectors are equal
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {boolean}
 */
spnr.v.equal = function(v1, v2) {
    return (v1.x == v2.x && v1.y == v2.y && v1.z == v1.z);
}

/**
 * Add v2 to v1. Modifies v1.
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 */
spnr.v.add = function(v1, v2) {
    v1.x += v2.x;
    v1.y += v2.y;
    v1.z += v2.z;
}

/**
 * Add v2 to a copy of v1. Doesn't modify v1 or v2.
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {spnr.Vector}
 */
spnr.v.copyAdd = function(v1, v2) {
    var v3 = spnr.v(
        v1.x + v2.x,
        v1.y + v2.y,
        v1.z + v2.z);
    return v3;
}

/**
 * Subtract v2 from v1. Modifies v1.
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 */
spnr.v.sub = function(v1, v2) {
    v1.x -= v2.x;
    v1.y -= v2.y;
    v1.z -= v2.z;
}

/**
 * Subtract v2 from a copy of v1. Doesn't modify v1 or v2.
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {spnr.Vector}
 */
spnr.v.copySub = function(v1, v2) {
    var v3 = spnr.v(
        v1.x - v2.x,
        v1.y - v2.y,
        v1.z - v2.z);
    return v3;
}

/**
 * Multiply a vector by a scalar value. Modifies the vector.
 * @param {spnr.Vector} v 
 * @param {number} amount 
 */
spnr.v.mult = function(v, amount) {
    v.x *= amount;
    v.y *= amount;
    v.z *= amount;
}

/**
 * Multiply a vector by a scalar value. Doesn't modify the vector.
 * @param {spnr.Vector} v 
 * @param {number} amount 
 * @returns {spnr.Vector}
 */
spnr.v.copyMult = function(v, amount) {
    var v2 = spnr.v(
        v.x * amount,
        v.y * amount,
        v.z * amount);
    return v2;
}

/**
 * Divide a vector by a scalar value. Modifies the vector.
 * @param {spnr.Vector} v 
 * @param {number} amount 
 */
spnr.v.div = function(v, amount) {
    v.x /= amount;
    v.y /= amount;
    v.z /= amount;
}

/**
 * Divide a vector by a scalar value. Doesn't modify the vector.
 * @param {spnr.Vector} v 
 * @param {number} amount 
 * @returns {spnr.Vector}
 */
spnr.v.copyDiv = function(v, amount) {
    var v2 = spnr.v(
        v.x / amount,
        v.y / amount,
        v.z / amount);
    return v2;
}

/**
 * Get the magnitude (length) of the vector.
 * @param {spnr.Vector} v 
 * @returns {number}
 */
spnr.v.magSq = function(v) {
    return v.x ** 2 + v.y ** 2 + v.z ** 2;
}

/**
 * Get the magnitude (length) squared of the vector.
 * @param {spnr.Vector} v 
 * @returns {number}
 */
spnr.v.mag = function(v) {
    return spnr.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
}

/**
 * Get the distance squared between two vectors.
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {number}
 */
spnr.v.distSq = function(v1, v2) {
    var displacementX = v2.x - v1.x;
    var displacementY = v2.y - v1.y;
    var displacementZ = v2.z - v1.z;
    return displacementX ** 2 + displacementY ** 2 + displacementZ ** 2;
}

/**
 * Get the distance between two vectors.
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {number}
 */
spnr.v.dist = function(v1, v2) {
    var displacementX = v2.x - v1.x;
    var displacementY = v2.y - v1.y;
    var displacementZ = v2.z - v1.z;
    return spnr.sqrt(displacementX ** 2 + displacementY ** 2 + displacementZ ** 2);
}

/**
 * Find the midpoint of the two vectors
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {Vectors}
 */
spnr.v.mean = function(v1, v2) {
    var halfDisplacementX = (v2.x - v1.x) / 2;
    var halfDisplacementY = (v2.y - v1.y) / 2;
    var halfDisplacementZ = (v2.z - v1.z) / 2;

    return spnr.v(
        v1.x + halfDisplacementX,
        v1.y + halfDisplacementY,
        v1.z + halfDisplacementZ);
}

/**
 * Normalize a vector, settings its magnitude to 1 without affecting rotation. Modifies the vector.
 * @param {spnr.Vector} v
 */
spnr.v.normalize = function(v) {
    var mag = spnr.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    v.x /= mag;
    v.y /= mag;
    v.z /= mag;
}

/**
 * Return a normalied copy of a vector. Does not modify the original vector.
 * @param {spnr.Vector} v 
 * @returns {spnr.Vector}
 */
spnr.v.copyNormalize = function(v) {
    var mag = spnr.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    return spnr.v(
        v.x / mag,
        v.y / mag,
        v.z / mag
    );
}

/**
 * Rotate a vector by a certain amount. Modifies the vector
 * @param {spnr.Vector} v 
 * @param {number} angle - angle to rotate the vector by
 * @param {boolean} [useDegrees=false] - whether the angle provided is in degrees or radians. If this value is not provided then defaults to radians.
 */
spnr.v.rotate = function(v, angle=0, useDegrees=false) {
    if (useDegrees) {
        angle /= spnr._180DIVPI;
    }
    
    var cos = spnr.cos(angle);
    var sin = spnr.sin(angle);

    // Assign to a temp variable to avoid messing with the v.x below
    var newX = v.x * cos - v.y * sin;
    // Don't assign to a temp variable because v.y isn't used again
    v.y = v.x * sin + v.y * cos;
    // Read from the temp variable
    v.x = newX;
}

/**
 * Return a rotated copy of a vector. Doesn't modify the original vector.
 * @param {spnr.Vector} v - vector to rotate
 * @param {number} angle - angle to rotate the vector by
 * @param {boolean} [useDegrees=false] - whether the angle provided is in degrees or radians. If this value is not provided then defaults to radians.
 * @returns {spnr.Vector}
 */
spnr.v.copyRotate = function(v, angle=0, useDegrees=false) {
    if (useDegrees) {
        angle /= spnr._180DIVPI;
    }
    
    var cos = spnr.cos(angle);
    var sin = spnr.sin(angle);

    return spnr.v(v.x * cos - v.y * sin,
        v.x * sin + v.y * cos);
}

/**
 * Get the heading (direction) of the vector
 * @param {spnr.Vector} v 
 * @param {boolean} [useDegrees=false] - whether to return the angle in radians or degrees. Defaults to radians. 
 * @returns {number}
 */
spnr.v.heading = function(v, useDegrees=false) {
    var heading = spnr.atan2(v.y, v.x);
    if (useDegrees) heading *= spnr._180DIVPI;
    return heading;
}

/**
 * Get the dot product of two vectors
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {number}
 */
spnr.v.dot = function(v1, v2) {
    var result = v1.x * v2.x;
    result += v1.y * v2.y;
    result += v1.z * v2.z;
    return result;
}

/**
 * Get the cross product of two vectors
 * @param {spnr.Vector} v1 
 * @param {spnr.Vector} v2 
 * @returns {spnr.Vector}
 */
spnr.v.cross = function(v1, v2) {
    var crossP = spnr.v(0, 0, 0);
    crossP.x = v1.y * v2.z - v1.z * v2.y;
    crossP.y = v1.z * v2.x - v1.x * v2.z;
    crossP.z = v1.x * v2.y - v1.y * v2.x;
    return crossP;
}

/**
 * Map a vectors components to specific ranges. Modifies the vector.
 * @param {spnr.Vector} v 
 * @param {spnr.Vector} oldMin 
 * @param {spnr.Vector} oldMax 
 * @param {spnr.Vector} newMin 
 * @param {spnr.Vector} newMax 
 */
spnr.v.map = function(v, oldMin, oldMax, newMin, newMax) {
    v.x = spnr.mapNum(v.x, oldMin.x, oldMax.x, newMin.x, newMax.x);
    v.y = spnr.mapNum(v.y, oldMin.y, oldMax.y, newMin.y, newMax.y);
    v.z = spnr.mapNum(v.z, oldMin.z, oldMax.z, newMin.z, newMax.z);
}

/**
 * Return a copy of a vector mapped to a specific range. Doesn't modify the vector.
 * @param {spnr.Vector} v 
 * @param {spnr.Vector} oldMin
 * @param {spnr.Vector} oldMax 
 * @param {spnr.Vector} newMin 
 * @param {spnr.Vector} newMax 
 * @returns {spnr.Vector}
 */
spnr.v.copyMap = function(v, oldMin, oldMax, newMin, newMax) {
    return spnr.v(
        spnr.mapNum(v.x, oldMin.x, oldMax.x, newMin.x, newMax.x),
        spnr.mapNum(v.y, oldMin.y, oldMax.y, newMin.y, newMax.y),
        spnr.mapNum(v.z, oldMin.z, oldMax.z, newMin.z, newMax.z)
    );
}

/**
 * Type representing Euler angles. Not a real class in that you can't instantiate one directly - instead use spnr.attitude(x, y, z).
 * @typedef {Object} Attitude
 * @memberof spnr
 * @property {number} heading - The heading of the attitude 
 * @property {number} pitch - The pitch of the attitude
 * @property {number} roll - The roll of the attitude
 */

/**
 * Create a new attitude (Euler angles) object.
 * @namespace
 * @param {number} heading - heading of the new attitude
 * @param {number} pitch - heading of the new attitude
 * @param {number} roll - heading of the new attitude
 * @returns {spnr.Attitude}
 */
spnr.attitude = function(heading, pitch, roll) {
    return {heading : heading, pitch : pitch, roll : roll};
}

/**
 * Deep-copy an attitude object
 * @param {spnr.Attitude} a 
 * @returns {spnr.Attitude}
 */
spnr.attitude.copy = function(a) {
    return spnr.attitude(a.heading, a.pitch, a.roll);
}

/**
 * Add the components of a2 to a1. Modifies a1
 * @param {spnr.Attitude} a1 
 * @param {spnr.Attitude} a2 
 */
spnr.attitude.add = function(a1, a2) {
    a1.heading += a2.heading;
    a1.pitch += a2.pitch;
    a1.roll += a2.roll;
}

/**
 * Add the components of a2 to a1. Doesn't modify either attitude
 * @param {spnr.Attitude} a1 
 * @param {spnr.Attitude} a2
 * @returns {spnr.Attitude} a new attitude equalling a1 + a2
 */
spnr.attitude.copyAdd = function(a1, a2) {
    var a3 = spnr.attitude.copy(a1);
    spnr.attitude.add(a3, a2);
    return a3;
}

/**
 * Subtract the components of a2 from a1. Modifies a1
 * @param {spnr.Attitude} a1 
 * @param {spnr.Attitude} a2 
 */
spnr.attitude.sub = function(a1, a2) {
    a1.heading -= a2.heading;
    a1.pitch -= a2.pitch;
    a1.roll -= a2.roll;
}

/**
 * Subtract the components of a2 from a1. Doesn't modify either attitude
 * @param {spnr.Attitude} a1 
 * @param {spnr.Attitude} a2
 * @returns {spnr.Attitude} a new attitude equalling a1 - a2
 */
spnr.attitude.copySub = function(a1, a2) {
    var a3 = spnr.attitude.copy(a1);
    spnr.attitude.sub(a3, a2);
    return a3;
}

/**
 * k an attitude by a scalar value. Modifies a.
 * @param {spnr.Attitude} a 
 * @param {number} amount 
 */
spnr.attitude.mult = function(a, amount) {
    a.heading *= amount;
    a.pitch *= amount;
    a.roll *= amount;
}

/**
 * Multiply an attitude by a scalar value. Doesn't modify a.
 * @param {spnr.Attitude} a 
 * @param {number} amount 
 * @returns {spnr.Attitude} a new attitude equalling a * amount
 */
spnr.attitude.copyMult = function(a, amount) {
    var a2 = spnr.attitude.copy(a);
    spnr.attitude.mult(a2, amount);
    return a2;
}

/**
 * Divide an attitude by a scalar value. Modifies a.
 * @param {spnr.Attitude} a 
 * @param {number} amount 
 */
spnr.attitude.div = function(a, amount) {
    a.heading /= amount;
    a.pitch /= amount;
    a.roll /= amount;
}

/**
 * Divide an attitude by a scalar value. Doesn't modify a.
 * @param {spnr.Attitude} a 
 * @param {number} amount 
 * @returns {spnr.Attitude} a new attitude equalling a / amount
 */
spnr.attitude.copyDiv = function(a, amount) {
    var a2 = spnr.attitude.copy(a);
    spnr.attitude.div(a2, amount);
    return a2;
}

/*
spnr.Sound = class {
    constructor(data, dataIsUrl=true) {
        // Create a sound using data
        // If dataIsUrl is true, then treat data as a url and load the sound from there
        // else treat data as a fileBlob and use that to create sound
        console.log('reciever', data, dataIsUrl)
        if (dataIsUrl) {
            fetch(data)
                .then(response => {return response.blob()})
                .then(blob => {
                    this.fileBlob = URL.createObjectURL(blob);
                    this.audio = new Audio(this.fileBlob); // forces a request for the blob
                });
        }
        else {
            this.fileBlob = data;
            this.audio = new Audio(this.fileBlob);
        }
        console.log('receiver', this.fileBlob);
    }

    play() {
        this.audio.play();
    }

    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.onended = () => {};
    }

    pause() {
        this.audio.pause();
    }

    loop() {
        this.play();
        this.onended = () => this.play();
    }

    set onended(val) {
        this.audio.onended = val;
    }

    copy() {
        console.log('copyer', this.fileBlob);
        return new spnr.Sound(this.fileBlob, false);
    }
}
*/

/**
 * Class to load and play audio
 */
spnr.Sound = class {
    /**
     * Create a new Sound
     * @param {string} url - url to load the audio from
     */
    constructor(url) {
        this.url = url;
        this.audio = new Audio(url);
    }

    /**
     * Start the audio playing (non-blocking)
     */
    play() {
        this.audio.play();
    }

    /**
     * Stop the audio playing and return to start
     */
    stop() {
        this.audio.pause();
        this.audio.currentTime = 0;

        /**
         * @private
         */
        this.onended = () => {};
    }

    /**
     * Stop the audio but don't reset playthrough position
     */
    pause() {
        this.audio.pause();
    }

    /** 
     * Start looping the audio (non-blocking)
    */
    loop() {
        this.play();
        this.onended = () => this.play();
    }
    set onended(val) {
        this.audio.onended = val;
    }

    /**
     * Create an independent copy of this Sound. Currently does that by refetching the URL (although browser might have cached it).
     * In future there are plans to make this reuse the same sound data.
     * @returns {Sound}
     */
    copy() {
        return new spnr.Sound(this.url);
    }
}

/**
 * A currently very basic class that keeps track of what keys are currently pressed 
 */
spnr.KeyWatcher = class {
    /**
     * Create a new KeyWatcher
     * @param {Element} [elem=document] elem - Element to watch. Defaults to whole document. 
     */
    constructor(elem=document) {
        this.elem = elem;

        this.keysDown = {};
        this.setupListeners();
    }

    setupListeners() {
        this.elem.addEventListener('keydown', event => {
            this.keysDown[event.code] = true;
        });
        this.elem.addEventListener('keyup', event => {
            this.keysDown[event.code] = false;
        });
    }

    /**
     * Check whether a key is down
     * @param {string} code - key.code of the key to be checked
     * @returns {boolean}
     */
    keyIsDown(code) {
        if (this.keysDown[code] != undefined) return this.keysDown[code];
        else return false;
    }
}

/**
 * Class to provide callbacks for mouse events and to allow querying of current mouse state
*/
spnr.MouseWatcher = class {
    /**
     * Create a new MouseWatcher
     * @param {Element} [elem=document] - Element to watch. Defaults to the whole document. 
     * @param {number} scale - Amount to scale the mouse position by. Mainly used in the game engine when a canvas is scaled.
     */
    constructor(elem=document, scale=1) {
        /**
         * Element to watch. Can be changed at any time although beware that things might be confused in the transition.
         * @type {Element}
         */
        this.elem = elem;
        /**
         * Amount to scale the mouse position by. Mainly used in the game engin when a canvas is scaled.
         * Can be changed at any time although beware that things might be confused in the transition.
         * @type {number}
         */
        this.scale = scale;

        /**
         * Current position of the mouse relative to this.elem and scaled by this.scale.
         * @type {Vector}
         * @readonly
         */
        this.position = spnr.v(0, 0);
        /**
         * Whether the pointer (mouse or touchscreen) is currently pressed on this.elem.
         * Recommended to use this over this.mouseDown or this.touchDown for general use cases.
         * @type {boolean}
         * @readonly
         */
        this.pointerDown = false;
        /**
         * Whether the mouse (only works on pc) is currently pressed on this.elem.
         * Recommended to use this.pointerDown instead for general use cases.
         * @type {boolean}
         * @readonly
         */
        this.mouseDown = false;
        /**
         * Whether the touchscreen (only works on mobile) is currently pressed on this.elem.
         * Recommended to use this.pointerDown instead for general use cases.
         * @type {boolean}
         * @readonly
         */
        this.touchDown = false;

        /**
         * FunctionGroup called when the mouse or touchscreen press is moved.
         * @type {FunctionGroup}
         */
        this.onMouseMove = new spnr.FunctionGroup();
        this.elem.addEventListener('mousemove', e => {
            var rect = e.target.getBoundingClientRect();
            this.position.x = (e.x - rect.left) / this.scale;
            this.position.y = (e.y - rect.top) / this.scale;
            this.onMouseMove.call(this.position, e);
        });
        
        /**
         * FunctionGroup called when the mouse (only works on pc) is pressed on this.elem.
         * @type {FunctionGroup}
         */
        this.onMouseDown = new spnr.FunctionGroup();
        this.elem.addEventListener('mousedown', e => {
            this.mouseDown = true;
            this.onMouseDown.call(this.position, e);
        });

        /**
         * FunctionGroup called when the mouse (only works on pc) is released on this.elem.
         * @type {FunctionGroup}
         */
        this.onMouseUp = new spnr.FunctionGroup();
        this.elem.addEventListener('mouseup', e => {
            this.mouseDown = false;
            this.onMouseUp.call(this.position, e);
        });

        /**
         * FunctionGroup called when the touchscreen (only works on mobile) is pressed on this.elem.
         * @type {FunctionGroup}
         */
        this.onTouchStart = new spnr.FunctionGroup();
        this.elem.addEventListener('touchstart', e => {
            this.touchDown = true;
            this.onTouchStart.call(this.position, e);
        });

        /**
         * FunctionGroup called when the touchscreen (only works on mobile) is released on this.elem.
         * @type {FunctionGroup}
         */
        this.onTouchEnd = new spnr.FunctionGroup();
        this.elem.addEventListener('touchend', e => {
            this.touchDown = false;
            this.onTouchEnd.call(this.position, e);
        });

        /**
         * FunctionGroup called when the mouse or touchscreen is pressed on this.elem.
         * @type {FunctionGroup}
         */
        this.onPointerDown = new spnr.FunctionGroup();
        this.elem.addEventListener('pointerdown', e => {
            this.pointerDown = true;
            this.onPointerDown.call(this.position, e);
        });

        /**
         * FunctionGroup called when the mouse or touchscreen is released on this.elem.
         * @type {FunctionGroup}
         */
        this.onPointerUp = new spnr.FunctionGroup();
        this.elem.addEventListener('pointerup', e => {
            this.pointerDown = false;
            this.onPointerUp.call(this.position, e);
        });
    }
}

/**
 * A collection of functions that can be run together.
 * Technically the functions don't have to accept the same parameters,
 * but weird things may happen if they don't.
 * Useful for things like listeners and callbacks.
 * @class
*/
spnr.FunctionGroup = class {
    /**
     * Create a new function group
     * @param {function[]} [o] initialFunctions - Array of functions to initialise with
    */
    constructor(initialFunctions = []) {
        this.functions = new Set(initialFunctions);
    }

    /**
     * Add a function to the group
     * @param {function} f - function to add
    */
    add(f) {
        this.functions.add(f);
    }

    /**
     * Add an array of functions to the group
     * @param {function[]} functionArray - functions to add
    */
    addBulk(functionArray) {
        functionArray.forEach(f => this.add(f));
    }

    /**
     * Remove a function from the group 
     * @param {function} f - function to remove
    */
    remove(f) {
        return this.functions.delete(f);
    }

    /**
     * Remove all functions from the group */
    removeAll() {
        this.functions = [];
    }

    /**
     * Call all the functions in the group. Call with arguments that you want to be passed to the functions, eg fg.call(valueToPass) */
    call() {
        this.functions.forEach(f => {
            f(...arguments);
        });
    }
}

spnr.NeuralNetwork = class {
    constructor() {
        this.inputs = [];
        this.hiddenLayers = [];
        this.outputs = [];
    }

    createInputLayer(size) {
        this.inputs = [];
        for (var i = 0; i < size; i ++) {
            this.inputs.push(new spnr.Neuron());
        }
    }

    addHiddenLayer(size) {
        var newLayer = [];
        for (var i = 0; i < size; i ++) {
            newLayer.push(new spnr.Neuron());
        }
        this.hiddenLayers.push(newLayer);
    }

    createOutputLayer(size) {
        this.outputs = [];
        for (var i = 0; i < size; i ++) {
            this.outputs.push(new spnr.Neuron());
        }
    }

    connect() {
        // connect input to first hidden
        this._connect2Layers(this.inputs, this.hiddenLayers[0]);
        // connect last hidden to output
        this._connect2Layers(this.hiddenLayers[this.hiddenLayers.length - 1], this.outputs);

        // connect hidden layers to each other
        for (var i = 0; i < this.hiddenLayers.length - 1; i ++) {
            var firstLayer = this.hiddenLayers[i];
            var secondLayer =  this.hiddenLayers[i + 1];
            this._connect2Layers(firstLayer, secondLayer);
        }
    }

    activate(input) {
        this.inputs.forEach((neuron, i) => neuron.activate(input[i]));
        this.hiddenLayers.forEach(layer => {
            layer.forEach(neuron => neuron.activate());
        });
        return this.outputs.map(neuron => neuron.activate());
    }

    train(dataset, iterations=1) {
        while(iterations > 0) {
            dataset.forEach(datum => {
                this.activate(datum.inputs);
                this.propagate(datum.outputs);
            });
            iterations--;
        }
    }

    propagate(target) {
        this.outputs.forEach((neuron, i) => neuron.propagate(target[i]));
        for (var i = this.hiddenLayers.length - 1; i >= 0; i --) {
            var layer = this.hiddenLayers[i];
            layer.forEach(neuron => neuron.propagate());
        }
        return this.inputs.forEach(neuron => neuron.propagate());
    }

    saveTraining() {
        var savedTraining = [];

        savedTraining.push(this._saveLayer(this.inputs));
        this.hiddenLayers.forEach(layer => {
            savedTraining.push(this._saveLayer(layer));
        });
        savedTraining.push(this._saveLayer(this.outputs));

        return savedTraining;
    }

    loadTraining(savedTraining) {
        this._loadLayer(savedTraining[0], this.inputs);
        this.hiddenLayers.forEach((layer, i) => {
            this._loadLayer(savedTraining[i + 1], layer);
        });
        this._loadLayer(savedTraining[this.hiddenLayers.length + 1], this.outputs);
    }

    _saveLayer(layer) {
        var savedLayer = [];
        layer.forEach(neuron => {
            var savedNeuron = [];
            savedNeuron.push(neuron.bias);

            var incomingWeights = Object.values(neuron.incoming.weights);
            savedNeuron.push(incomingWeights);
            var outgoingWeights = Object.values(neuron.outgoing.weights);
            savedNeuron.push(outgoingWeights);

            savedLayer.push(savedNeuron);
        });
        return savedLayer;
    }

    _loadLayer(savedLayer, neuronObjs) {
        for (var i = 0; i < neuronObjs.length; i ++) {
            var neuron = neuronObjs[i];
            var values = savedLayer[i];

            // set the bias (the first item in a saved neuron)
            neuron.bias = values.shift();
            
            // then set the weights of the connections
            setValues(neuron.incoming.weights, values[0]);
            setValues(neuron.outgoing.weights, values[1]);
        }
    }

    _connect2Layers(layer1, layer2) {
        layer1.forEach(neuron => {
            layer2.forEach(neuron2 => {
                neuron.connect(neuron2);
            });
        });
    }
}

spnr.Neuron = class {
    constructor(bias=spnr.randflt(-1, 1)) {
        this.id = spnr.uniqueId();
        this.bias = bias;

        this.incoming = {
            weights : {},
            targets : {}
        }

        this.outgoing = {
            weights : {},
            targets : {}
        }

        this._output;
        this.output;
        this.error;
    }
    
    connect(neuron, weight=spnr.randflt(0, 1)) {
        this.outgoing.targets[neuron.id] = neuron;
        neuron.incoming.targets[this.id] = this;
        neuron.incoming.weights[this.id] = weight;
        
        if (neuron.incoming.weights[this.id] == undefined) {
            this.outgoing.weights[neuron.id] = spnr.randflt(-1, 1);
        }
        else {
            this.outgoing.weights[neuron.id] = weight;
        }
    }

    activate(input) {
        if (input != undefined) {
            this._output = 1;
            this.output = input;
        }
        else {
            var targetIds = Object.keys(this.incoming.targets);
            var sum = targetIds.reduce((total, target) => {
                return total += this.incoming.targets[target].output * this.incoming.weights[target];
            }, this.bias);
            
            this._output = spnr.invSigmoid(sum);
            this.output = spnr.sigmoid(sum);
        }

        return this.output;
    }
    
    propagate(target, rate=0.3) {
        var outgoingIds = Object.keys(this.outgoing.targets);     
        
        if (target == undefined) {
            var sum = outgoingIds.reduce((total, target, index) => {
                var targetObj = this.outgoing.targets[target];
                this.outgoing.weights[target] -= rate * targetObj.error * this.output;
                this.outgoing.targets[target].incoming.weights[this.id] = this.outgoing.weights[target];
                
                total += targetObj.error * this.outgoing.weights[target];
                return total;
            }, 0);
        }
        else {
            var sum = this.output - target;
        }
        
        // 𝛿squash/𝛿sum
        this.error = sum * this._output
        
        // Δbias
        this.bias -= rate * this.error;
        
        return this.error;
    }
}

/**
 * Lightweight code-only game engine using PIXI.js for rendering.
 * If using, you must include PIXI version 5 or greater in your project and then run {@link spnr.GameEngine.init}.
 * @namespace
 */
spnr.GameEngine = class {
    /**
     * Initialize the game engine
     * @param {spnr.Vector} canvasSize - initial canvas size. See {@link spnr.GameEngine.setGlobalScale} for details on canvas scaling and sizing
     * @param {number} globalScale - scale multiplier for the canvas size
     * @param {number} backgroundColor - background color in hex format. eg 0xff0000 is red.
     */
    static init(canvasSize, globalScale, backgroundColor=0x000000) {
        spnr.internalWarn('spnr.GameEngine is an undocumented, untested festure. Use with caution');
        
        // Set these so the children know where they are
        this.globalPosition = spnr.v(0, 0);
        this.globalAngle = 0;

        this.setGlobalScale(globalScale);

        this.createPixiApp(canvasSize, backgroundColor);

        this.deselectCrntScene();

        this.keyboard = new spnr.KeyWatcher();
        this.mouse = new spnr.MouseWatcher(this.pixiApp.view);
    }

    // Pixi stuff and canvas stuff
    // ---------------------------

    /**
     * @private
     */
    static createPixiApp(canvasSize, backgroundColor) {
        this.pixiApp = new PIXI.Application({
            width : canvasSize.x * this.globalScale,
            height : canvasSize.y * this.globalScale,
            backgroundColor : backgroundColor,
            resolution : window.devicePixelRatio || 1
        });
        document.body.appendChild(this.pixiApp.view);

        this.pixiApp.ticker.add(() => this.update());

        this.pixiApp.stage.pivot.set(0.5, 0.5);

        this.setCanvasSize(canvasSize);
        this.setGlobalScale(this.globalScale);
    }

    /**
     * Set the canvas size. Note that the true canvas size will be different - see {@link spnr.GameEngine.setGlobalScale} for details.
     * @param {spnr.Vector} size - new size
     */
    static setCanvasSize(size) {
        /**
         * todo: make jsdoc pick this up
         */
        this.canvasSize = spnr.v.copy(size);

        this.pixiApp.view.width = this.canvasSize.x * this.globalScale;
        this.pixiApp.view.height = this.canvasSize.y * this.globalScale;

        this.pixiApp.renderer.resize(this.canvasSize.x * this.globalScale,
            this.canvasSize.y * this.globalScale)
    }

    /**
     * Choose an automatic canvas sizer to use. Greatly recommended to use as it adapts to different window sizes.
     * @param {spnr.GameEngine.canvasSizers.AbstractCanvasSizer} canvasSizer 
     */
    static selectCanvasSizer(canvasSizer=null) {
        this.crntCanvasSizer = canvasSizer;
    }

    /**
     * Set the global scale of the canvas. From the viewpoint of an entity on the canvas, it will still be the same width in pixels.
     * However, the size of the canvas displayed to the user will be increased.
     * @param {number} scale 
     */
    static setGlobalScale(scale) {
        this.globalScale = scale;
        if (this.pixiApp != undefined) {
            this.pixiApp.stage.scale.set(this.globalScale, this.globalScale);
        }
        if (this.canvasSize != undefined) {
            this.setCanvasSize(this.canvasSize); // resize actual canvas
        }
    }

    /**
     * Remove all items from the pixi app (clear canvas)
     * @private
     */
    static removeChildrenFromPixiApp() {
        while(this.pixiApp.stage.children.length > 0) { 
            this.pixiApp.stage.removeChild(this.pixiApp.stage.children[0]);
        }
    }

    /**
     * Background color of the canvas. See {@link spnr.GameEngine.init} for color details
     * @readonly
     */
    static get backgroundColor() {
        return this.pixiApp.renderer.backgroundColor;
    }

    /**
     * Set the background color
     * @param {number} color 
     */
    static setBackgroundColor(color) {
        this.pixiApp.renderer.backgroundColor = color;
    }

    // Scenes
    // ------

    /**
     * Select the current scene of the game engine
     * @param {*} scene 
     */
    static selectScene(scene) {
        this.deselectCrntScene();
        
        this.crntScene = scene;
        
        if (scene != null) {
            scene.select(this.pixiApp);
            scene.setParent(this);
        }
    }

    /**
     * Set the current scene to nothing, displaying just the background color
     */
    static deselectCrntScene() {
        if (this.crntScene != null) {
            this.crntScene.deselect();
            this.removeChildrenFromPixiApp();
        }

        this.crntScene = null;
    }

    // Entity lookup
    // -------------

    /**
     * Get a flattened list of all the entities in the scene
     * @returns {spnr.GameEngine.Entity[]}
     */
    static get entitiesInScene() {
        if (this.crntScene != null) {
            return this.crntScene.flattenedChildList;
        }
        else {
            return [];
        }
    }

    /**
     * Get all entities with a specific name
     * @param {string} name - name of the entities to find
     * @returns {spnr.GameEngine.Entity[]}
     */
    static getEntitiesWithName(name) {
        var searchResults = [];
        this.entitiesInScene.forEach(entity => {
            if (entity.name == name) searchResults.push(entity);
        });
        return searchResults;
    }

    /**
     * Get all entities without a specific name. Not sure why you'd want it. 
     * @param {string} name 
     * @returns {spnr.GameEngine.Entity[]}
     */
    static getEntitiesWithoutName(name) {
        var searchResults = [];
        this.entitiesInScene.forEach(entity => {
            if (entity.name != name) searchResults.push(entity);
        });
        return searchResults;
    }

    /**
     * Get all entities with one or more of a set of names
     * @param {string[]} names 
     * @returns {spnr.GameEngine.Entity[]}
     */
    static getEntitiesWithNames(names) {
        var searchResults = [];
        this.entitiesInScene.forEach(entity => {
            // Use for...of to allow break
            for (var name of names) {
                if (entity.name == name) {
                    searchResults.push(entity);
                    break;
                }
            }
        });
        return searchResults;
    }

    /**
     * Get all entities with a specific tag
     * @param {string} tag 
     * @returns {spnr.GameEngine.Entity[]}
     */
    static getEntitiesWithTag(tag) {
        var searchResults = [];
        this.entitiesInScene.forEach(entity => {
            if (entity.tags.includes(tag)) searchResults.push(entity);
        });
        return searchResults;
    }

    /**
     * Get all entities with one or more of a set of tags
     * @param {string[]} tags 
     * @returns {spnr.GameEngine.Entity[]}
     */
    static getEntitiesWithTags(tags) {
        var searchResults = [];
        this.entitiesInScene.forEach(entity => {
            // Use for...of to allow break
            for (var tag of tags) {
                if (entity.tags.includes(tag)) {
                    searchResults.push(entity);
                    break;
                }
            }
        });
        return searchResults;
    }

    // Main method
    // -----------

    static update() {
        this.deltaTime = this.pixiApp.ticker.elapsedMS / 1000;

        if (this.crntScene != null) {
            this.crntScene.internalUpdate();
        }

        if (this.crntCanvasSizer != null) {
            this.crntCanvasSizer.updateCanvasSize();
        }

        this.mouse.scale = this.globalScale; // update mouse position scale
    }
}

/**
 * Basic entity in the game engine. Can be parented to a scene or other entities.
 * Not very useful on its own, designed to be extended to add behaviour
 * @class
 */
spnr.GameEngine.Entity = class {
    /**
     * Create a new entity.
     * @param {string} name - name of the entity. Doesn't have to be unique but setting a good name can help with debugging. 
     * @param {spnr.Vector} localPosition - position of the entity relative to parent
     * @param {number} localAngle - rotation of the entity relative to parent. Rotation is applied after position.
     */
    constructor(name, localPosition, localAngle) {
        this.rename(name);

        this.setLocalPosition(localPosition);
        this.setLocalAngle(localAngle);

        this.tags = [];

        this.children = [];

        this.containingScene = null;
    }

    // Misc
    // ----

    /**
     * Set name
     * @param {string} name - new name 
     */
    rename(name) {
        this.name = name;
    }

    /**
     * Add a tag to the entity. Tags are useful for looking up entities of a specific type - see {@link spnr.GameEngine.getEntitiesWithTag}.
     * An entity can have multiple tags. You can add the same tag multiple times but why would you want to.
     * @param {string} tag 
     */
    addTag(tag) {
        this.tags.push(tag);
    }

    /**
     * Add multiple tags to the entity at once
     * @param {string[]} tagArray 
     */
    addTags(tagArray) {
        this.tags.push(...tagArray);
    }

    /**
     * Remove a tag from the entity. If the tag has been added multiple times, then it will only remove one instance of the tag.
     * @param {string[]} tag 
     */
    removeTag(tag) {
        spnr.arr.removeItem(this.tags, tag);
    }

    // Position
    // --------

    
    /**
     * Get the global position of the entity, relative to the canvas.
     * Avoid where possible it very much because it's recursive and thus slow.
     * (future improvements include adding a cache)
     * @type {spnr.Vector}
     * @readonly
     */
    get globalPosition() {
        var rotatedLocalPosition = spnr.v.copy(this.localPosition);
        spnr.v.rotate(rotatedLocalPosition, this.parent.localAngle);
        return spnr.v.copyAdd(this.parent.globalPosition, rotatedLocalPosition);
    }

    /**
     * Set the position of this entity relative to its parent.
     * @param {spnr.Vector} position 
     */
    setLocalPosition(position) {
        /**
         * Local position of this entity relative to parent. In pixels (assuming canvas is not scaled).
         * @member
         * @type {spnr.Vector}
         * @readonly
         */
        this.localPosition = spnr.v.copy(position);
    }

    /**
     * Set the global position of this entity.
     * Avoid where possible because it's recursive and thus slow.
     * @param {spnr.Vector} position 
     */
    setGlobalPosition(position) {
        this.setLocalPosition(spnr.v.copySub(position, this.parent.globalPosition));
    }

    // Angle
    // -----

    /**
     * Get the global angle of this entity, relative to the canvas.
     * Avoid where possible because it's recursive and thus slow.
     * @type {number}
     * @readonly
     */
    get globalAngle() {
        return this.parent.globalAngle + this.localAngle;
    }

    /**
     * Set the local angle of this entity, relative to the parent
     * @param {number} angle 
     */
    setLocalAngle(angle) {
        /**
         * Local rotation of this entity relative to parent. In radians.
         * @type {number}
         * @member
         * @readonly
         */
        this.localAngle = angle;
    }

    /**
     * Set the global angle of this entity
     * @param {number} angle 
     */
    setGlobalAngle(angle) {
        this.setLocalAngle(angle - this.parent.globalAngle);
    }

    // Pixi and adding to scene
    // ------------------------

    /**
     * Whether this entity is currently in a scene
     * @type {boolean}
     */
    get isInScene() {
        return this.containingScene != null;
    }

    /**
     * Set a direct reference to the scene that this is in
     * @private
     * @param {spnr.GameEngine.Scene} scene 
     */
    setContainingScene(scene) {
        // do nothing except add children - overwrite in drawable entities
        this.containingScene = scene;
        if (this.containingScene != null) {
            this.containingScene.flattenedChildList.push(this);
        }
        this.setChildrensContainingScene(scene);
    }

    /**
     * Set the containing scene for the entity's children. Call through {@link spnr.GameEngine.Entity.setContainingScene}
     * @private
     * @param {spnr.GameEngine.Scene} scene 
     */
    setChildrensContainingScene(scene) {
        this.children.forEach(child => {
            child.setContainingScene(scene);
        });
    }

    /**
     * Called when is removed from a scene
     * @private
     */
    removeFromContainingScene() {
        this.removeChildrenFromContainingScene();
        if (this.containingScene != null) {
            spnr.arr.removeItem(this.containingScene.flattenedChildList, this);
        }
        this.containingScene = null;
    }

    /**
     * Called when is removed from a scene. Call through {@link spnr.GameEngine.Entity.removeFromContainingScene}
     * @private
     */
    removeChildrenFromContainingScene() {
        this.children.forEach(child => {
            child.removeFromContainingScene();
        });
    }

    // Children/parents
    // ----------------

    /**
     * Remove all children from this scene
     */
    removeChildren() {
        // While there are children, remove the first child
        while (this.children.length > 0) {
            this.removeChild(this.children[0]);
        }
    }

    /**
     * Add a child entity.
     * @param {spnr.GameEngine.Entity} entity 
     * @returns {boolean} - whether the entity was  added (if false, it means the entity was already a child)
     */
    addChild(entity) {
        // If the entity is already a child, then don't do anything
        if (this.children.includes(entity)) {
            spnr.internalWarn(`Could not add entity '${entity.name}' to entity '${this.name}' as it is already a child`);
            return false;
        }
        else {
            this.children.push(entity);
            entity.setParent(this);
            return true;
        }
    }

    /**
     * Remove a specific entity from this
     * @param {spnr.GameEngine.Entity} entity 
     * @returns {boolean} - whether the entity was removed (if false, it means the entity was not a child to begin with)
     */
    removeChild(entity) {
        var indexOfEntity = this.children.indexOf(entity);

        // If the entity is not a child, then do nothing
        if (indexOfEntity == -1) {
            spnr.internalWarn(`Could not remove entity '${entity.name}' from entity '${this.name}' as it is not a child`);
            return false;
        }
        else {
            spnr.arr.removeItem(this.children, entity);
            entity.removeFromContainingScene();
            entity.removeParent();
            return true;
        }
    }

    /**
     * Set the parent of the entity. Called through {@link spnr.GameEngine.Entity.addChild}.
     * @param {spnr.GameEngine.Entity} parent 
     * @private
     */
    setParent(parent) {
        this.parent = parent;

        if (this.parent != null) {

            if (this.parent.isInScene) {
                this.setContainingScene(this.parent.containingScene);
            }

        }
        else {
            this.setContainingScene(null);
        }
    }

    /**
     * Unset the parent of the entity. Called through {@link spnr.GameEngine.Entity.removeChild}
     * @private
     */
    removeParent() {
        this.setParent(null);
        this.setContainingScene(null);
    }

    // Update

    /**
     * Update the children of the entity
     * @private
     */
    updateChildren() {
        this.children.forEach(child => {
            child.internalUpdate();
        });
    }

    /**
     * Internal update method called by the engine
     * @private
     */
    internalUpdate() {
        this.updateChildren();
        this.update();
    }

    /**
     * Update method called every frame. Override this to add behaviour to entities.
     * @virtual
     */
    update() { }
}

/**
 * Scene class that can be selected and displayed.
 * @class
 * @extends {spnr.GameEngine.Entity}
 */
spnr.GameEngine.Scene = class extends spnr.GameEngine.Entity {
    /**
     * Create a new scene
     * @param {string} name 
     * @param {spnr.Vector} localPosition 
     * @param {number} localAngle 
     */
    constructor(name, localPosition=spnr.v(0, 0), localAngle=0) {
        super(name, localPosition, localAngle);

        this.pixiContainer = new PIXI.Container();

        this.isSelected = false;
        this.flattenedChildList = [];
    }

    /**
     * I'm not sure what this does and maybe it's broken
     * @private
     */
    get globalAngle() {
        return 0;
    }

    /**
     * Set the background sound, which loops whenever the scene is selected
     * @param {spnr.Sound} sound 
     */
    setBackgroundSound(sound) {
        /**
         * Sound that loops whenever the scene is selected
         * @member
         * @readonly
         * @type {spnr.Sound}
         */
        this.backgroundSound = sound;
        spnr.internalLog('Does this need a copy or something?');

        if (this.isSelected) {
            this.startBackgroundSound();
        }
    }

    /**
     * @private
     */
    startBackgroundSound() {
        if (this.backgroundSound != null) {
            this.backgroundSound.loop();
        }
    }

    /**
     * @private
     */
    stopBackgroundSound() {
        if (this.backgroundSound != null) {
            this.backgroundSound.stop();
        }
    }

    /**
     * Add a child to the scene
     * @param {spnr.GameEngine.Entity} child 
     */
    addChild(child) {
        var inheritedFunc = spnr.GameEngine.Entity.prototype.addChild.bind(this);
        var childAdded = inheritedFunc(child);

        if (childAdded) {
            child.setContainingScene(this);
        }
    }

    /**
     * Method run when the scene is selected. Override to use.
     * @virtual
     */
    onSelected() {

    }

    /**
     * Do not call directly, call through spnr.GameEngine.selectScene
     * @param {PIXI.Application} pixiApp 
     * @private
     */
    select(pixiApp) {
        this.isSelected = true;

        this.parentAppPointer = pixiApp;
        
        pixiApp.stage.addChild(this.pixiContainer);

        this.startBackgroundSound();
        this.onSelected();
    }

    /**
     * Method run when the scene is deselected. Override to use.
     * @virtual
     */
    onDeselected() {
        
    }
    /**
     * Do not call directly, call through spnr.GameEngine.deselectCrntScene or spnr.GameEngine.selectScene(aSceneOtherThanThisOne)
     * @private
     */
    deselect() {
        this.isSelected = false;
        this.parentAppPointer.stage.removeChild(this.pixiContainer);
        this.parentAppPointer = null;

        this.stopBackgroundSound();
        this.onDeselected();
    }

    /**
     * Override of setParent to make it just parent the game engine
     * @param {spnr.GameEngine} gameEngine 
     * @private
     */
    setParent(gameEngine) {
        this.parent = gameEngine;
    }

    /**
     * @private
     */
    internalUpdate() {
        this.updateChildren();
        this.update();

        this.pixiContainer.rotation = this.localAngle;
    }
}

/**
 * Actually just a PIXI texture.
 * @class
 */
spnr.GameEngine.Texture = {};

/**
 * Load a texture from a URL
 * @param {string} url 
 * @returns {spnr.GameEngine.Texture}
 * @static
 */
spnr.GameEngine.Texture.fromUrl = function(url) {
    return PIXI.Texture.from(url);
}

/**
 * Drawable entity (sprite) class.
 * @extends {spnr.GameEngine.Entity}
 * @class
 */
spnr.GameEngine.DrawableEntity = class extends spnr.GameEngine.Entity {
    /**
     * Create a new drawable entity (sprite)
     * @param {string} name 
     * @param {spnr.Vector} localPosition 
     * @param {number} localAngle 
     * @param {spnr.GameEngine.Texture} texture 
     * @param {spnr.Vector} textureSize 
     * @param {spnr.Vector} [anchor=spnr.v(0.5, 0.5)] - Position of texture relative to origin, from 0,0 to 1,1. 
     */
    constructor(name, localPosition, localAngle, texture, textureSize, anchor=spnr.v(0.5, 0.5)) {
        super(name, localPosition, localAngle);

        this.setTexture(texture, textureSize);
        this.setAnchor(anchor);
        this.setTint(0xffffff);

        this.setupMouseInteraction();
    }

    /**
     * Helper to set up mouse interactions so we don't bloat constructor
     * @private
     */
    setupMouseInteraction() {
        if (this.mouseHovering == undefined) {
            /**
             * Whether the mouse is currently hovering over this
             * @type {boolean}
             * @member
            */
            this.mouseHovering = false;
        }

        this.sprite.interactive = true;

        if (this.mouseDownCallbacks == undefined) {
            /**
             * Function group called when mouse or touchscreen press starts over this
             * @type {spnr.FunctionGroup}
             * @member
             */
            this.mouseDownCallbacks = new spnr.FunctionGroup();
        }
        this.sprite.mousedown = data => this.mouseDownCallbacks.call(data);
        this.sprite.touchstart = data => this.mouseDownCallbacks.call(data);
        
        if (this.mouseUpCallbacks == undefined) {
            /**
             * Function group called when mouse or touchscreen press ends over this
             * @type {spnr.FunctionGroup}
             * @member
             */
            this.mouseUpCallbacks = new spnr.FunctionGroup();
        }
        this.sprite.mouseup = data => this.mouseUpCallbacks.call(data);
        this.sprite.touchend = data => this.mouseUpCallbacks.call(data);

        
        if (this.mouseOverCallbacks == undefined) {
            /**
             * Function group called when mouse or touchscreen touch enters this
             * @type {spnr.FunctionGroup}
             * @member
             */
            this.mouseOverCallbacks = new spnr.FunctionGroup();
        }
        this.sprite.mouseover = data => {
            this.mouseHovering = true;
            this.mouseOverCallbacks.call(data);
        }

        if (this.mouseOutCallbacks == undefined) {
            /**
             * Function group called when mouse or touchscreen touch exits this
             * @type {spnr.FunctionGroup}
             * @member
             */
            this.mouseOutCallbacks = new spnr.FunctionGroup();
        }
        this.sprite.mouseout = data => {
            this.mouseHovering = false;
            this.mouseOutCallbacks.call(data);
        }
    }

    /**
     * Get the corner positions of this. Not sure why it was implemented.
     * @returns {spnr.Vector[]} corners in order [topLeft, topRight, bottomRight, bottomLeft]
     */
    getGlobalCornerPositions() {
        // Cache global position here for more speed
        var globalPosition = this.globalPosition;
        
        var topLeftPos = spnr.v(this.textureSize.x * -(1 - this.anchor.x),
            this.textureSize.y * -(1 - this.anchor.y));
        spnr.v.rotate(topLeftPos, this.localAngle);
        spnr.v.add(topLeftPos, globalPosition);

        var topRightPos = spnr.v(this.textureSize.x * this.anchor.x,
            this.textureSize.y * -(1 - this.anchor.y));
        spnr.v.rotate(topRightPos, this.localAngle);
        spnr.v.add(topRightPos, globalPosition);

        var bottomRightPos = spnr.v(this.textureSize.x * this.anchor.x,
            this.textureSize.y * this.anchor.y);
        spnr.v.rotate(bottomRightPos, this.localAngle);
        spnr.v.add(bottomRightPos, globalPosition);

        var bottomLeftPos = spnr.v(this.textureSize.x * -(1 - this.anchor.x),
            this.textureSize.y * this.anchor.y);
        spnr.v.rotate(bottomLeftPos, this.localAngle);
        spnr.v.add(bottomLeftPos, globalPosition);

        return [topLeftPos, topRightPos, bottomRightPos, bottomLeftPos];
    }

    /**
     * Set the texture size
     * @param {spnr.Vector} size 
     */
    setTextureSize(size) {
        /**
         * Size of the texture, in pixels
         * @readonly
         * @type {spnr.Vector}
         * @member
         */
        this.textureSize = spnr.v.copy(size);
        this.sprite.width = this.textureSize.x;
        this.sprite.height = this.textureSize.y;
    }

    /**
     * @private
     * @param {spnr.GameEngine.Scene} scene 
     */
    setContainingScene(scene) {
        this.containingScene = scene;
        if (scene != null) {
            scene.pixiContainer.addChild(this.sprite);
            this.setChildrensContainingScene(scene);
            this.containingScene.flattenedChildList.push(this);
        }
    }

    /**
     * @private
     */
    removeFromContainingScene() {
        if (this.containingScene != null) {
            this.containingScene.pixiContainer.removeChild(this.sprite);
            this.removeChildrenFromContainingScene();
            spnr.arr.removeItem(this.containingScene.flattenedChildList, this);
        }
        this.containingScene = null;
    }

    /**
     * Set the texture size of this entity
     * @param {spnr.GameEngine.Texture} texture 
     * @param {spnr.Vector} textureSize 
     */
    setTexture(texture, textureSize=this.textureSize) {
        if (this.sprite != undefined) {
            var containingScene = this.containingScene;
            var anchor = this.sprite.anchor;

            if (containingScene != undefined) {
                this.removeFromContainingScene(); // remove old sprite
            }
        }

        this.sprite = new PIXI.Sprite(texture);
        this.setTextureSize(textureSize);
        this.setupMouseInteraction();
        if (this.parent != null) this.updateSpritePosition();
        if (this.tint != undefined) {
            this.setTint(this.tint);
        }

        if (containingScene != undefined) {
            this.setContainingScene(containingScene); // add new sprite
        }
        if (anchor != undefined) {
            this.setAnchor(anchor);
        }
    }

    /**
     * Set anchor of the texture, from 0,0 to 1,1
     * @param {spnr.Vector} position 
     */
    setAnchor(position) {
        this.anchor = spnr.v.copy(position);
        this.sprite.anchor.x = position.x;
        this.sprite.anchor.y = position.y;
    }

    /**
     * Set tint (color) of entity. If the entity is a white texture, then tint will directly correspond to color.
     * @param {number} tint 
     */
    setTint(tint) {
        this.sprite.tint = tint;
    }

    /**
     * Tint of the entity
     * @readonly
     * @type {number}
     * @member
     */
    get tint() {
        return this.sprite.tint;
    }

    /**
     * Set whether the entity is visible
     * @param {boolean} state 
     */
    setVisible(state) {
        this.sprite.visible = state;
    }

    /**
     * Whether the entity is visible
     * @member
     * @readonly
     * @type {boolean}
     */
    get visible() {
        return this.sprite.visible;
    }

    /**
     * Set alpha (transparency) of the entity
     * @param {number} alpha - transparency from 0 to 1
     */
    setAlpha(alpha) {
        this.sprite.alpha = alpha;
    }

    /**
     * Transparency of the entity from 0 to 1
     * @member
     * @readonly
     * @type {number}
     */
    get alpha() {
        return this.sprite.alpha;
    }

    /**
     * Update the sprite's position
     * @private
     */
    updateSpritePosition() {
        var globalPosition = this.globalPosition;
        this.sprite.position.set(globalPosition.x, globalPosition.y);
        this.sprite.rotation = this.globalAngle + spnr.PI;
    }

    /**
     * Internal update method called by the engine
     * @private
     */
    internalUpdate() {
        this.updateSpritePosition();

        // This needs to be after the block above - 
        // otherwise, if this entity's parent gets removed in update(),
        // the call to globalPosition above will break
        this.updateChildren();
        this.update();
    }
}

/**
 * Label/text class
 * @class
 * @extends {spnr.GameEngine.Entity}
 */
spnr.GameEngine.Label = class extends spnr.GameEngine.Entity {
    /**
     * Create a new label
     * @param {string} name 
     * @param {string} text 
     * @param {spnr.Vector} localPosition 
     * @param {number} localAngle 
     * @param {object} format - see {@link https://pixijs.io/pixi-text-style/}
     * @param {spnr.Vector} anchor - position of drawn text relative to origin. From 0,0 to 1,1 
     */
    constructor(name, text, localPosition, localAngle,
        format={}, anchor=spnr.v(0.5, 0.5)) {
        super(name, localPosition, localAngle);

        this.setTextFormat(format);
        this.setText(text);
        this.setAnchor(anchor);
    }

    /**
     * @private
     * @param {spnr.GameEngine.Scene} scene 
     */
    setContainingScene(scene) {
        this.containingScene = scene;
        if (scene != null) {
            scene.pixiContainer.addChild(this.textSprite);
            this.setChildrensContainingScene(scene);
            this.containingScene.flattenedChildList.push(this);
        }
    }

    /**
     * @private
     */
    removeFromContainingScene() {
        if (this.containingScene != null) {
            this.containingScene.pixiContainer.removeChild(this.textSprite);
            this.removeChildrenFromContainingScene();
            spnr.arr.removeItem(this.containingScene.flattenedChildList, this);
        }
        this.containingScene = null;
    }
    /**
     * Set the format/styling of the text.
     * @param {object} format - see {@link https://pixijs.io/pixi-text-style/} 
     */
    setTextFormat(format) {
        /**
         * see {@link https://pixijs.io/pixi-text-style/}
         * @member
         * @type {object}
         * @readonly
         */
        this.textFormat = spnr.obj.oneLevelCopy(format);
        
        // Protection for before the text is set
        if (this.text != undefined) {
            
            this.updateTextSprite();
        }
    }

    /**
     * Set the text. Quite slow so only call if you need to
     * @param {string} text 
     */
    setText(text) {
        this.text = text;

        // Protection for before the text format is set
        if (this.text != undefined) {
            
            this.updateTextSprite();
        }
    }

    setAnchor(position) {
        // from 0,0 to 1,1

        this.textSprite.anchor.x = position.x;
        this.textSprite.anchor.y = position.y;
    }

    /**
     * Set whether the text is visible
     * @param {boolean} state 
     */
    setVisible(state) {
        this.textSprite.visible = state;
    }

    /**
     * Whether the text is visible
     * @member
     * @type {boolean}
     * @readonly
     */
    get visible() {
        return this.textSprite.visible;
    }

    /**
     * @private
     */
    internalUpdate() {
        this.updateChildren();
        this.update();

        var globalPosition = this.globalPosition;
        this.textSprite.position.set(globalPosition.x, globalPosition.y);
        this.textSprite.rotation = this.globalAngle + spnr.PI;
    }

    /**
     * Force-update the text sprite (mainly used by the engine). Quite slow so don't call unless you need to.
     */
    updateTextSprite() {
        if (this.textSprite != undefined) {
            if (this.textSprite.parent != undefined) {
                // Remove the old sprite
                var oldParent = this.textSprite.parent;
                oldParent.removeChild(this.textSprite);
            }
            var oldAnchor = this.textSprite.anchor;
        }
        this.textSprite = new PIXI.Text(this.text, this.textFormat);

        if (oldAnchor != undefined) {
            this.setAnchor(oldAnchor);
        }

        if (oldParent != undefined) {
            oldParent.addChild(this.textSprite);
        }
    }
}

/**
 * Clickable button.
 * @extends {spnr.GameEngine.DrawableEntity}
 */
spnr.GameEngine.Button = class extends spnr.GameEngine.DrawableEntity {
    /**
     * Create a new button. Yes constructor is confusing, maybe in future we will use a dictionary to emulate named parameters
     * @param {string} name 
     * @param {spnr.Vector} localPosition 
     * @param {name} localAngle 
     * @param {spnr.Vector} size - size in pixels of the button background. If null then defaults to a transparent background.
     * @param {spnr.GameEngine.Texture} background 
     * @param {string} text 
     * @param {object} textFormat - see {@link spnr.GameEngine.Label}
     * @param {spnr.Vector} anchor 
     */
    constructor(name, localPosition, localAngle, size, background=null,
        text='', textFormat={}, anchor) {

        if (background === null) background = PIXI.Texture.Empty;

        super(name, localPosition, localAngle, background, size, anchor);
        
        /**
         * Text of the button.
         * @type {spnr.GameEngine.Label}
         * @member
         */
        this.label = new spnr.GameEngine.Label(this.name + ' label', text,
            spnr.v(0, 0), 0, textFormat);
        this.addChild(this.label)
    }
}

spnr.GameEngine.colliderTypes = {
    circle : 'circle'
}

/**
 * Base collider for spnr.GameEngine.
 * Colliders aren't really implemented yet so this documentation is a placeholder.
 * @class
 */
spnr.GameEngine.BaseCollider = class extends spnr.GameEngine.Entity {
    constructor(name, type, localPosition, localAngle) {
        super(name, localPosition, localAngle);

        this.type = type;

        this.colliding = false;

        this.collideStartCallbacks = new spnr.FunctionGroup();
        this.collideEndCallbacks = new spnr.FunctionGroup();
    }
}

/**
 * Circular collider type. Currently the only collider implemented
 * @class
 * @extends {spnr.GameEngine.BaseCollider}
 */
spnr.GameEngine.CircleCollider = class extends spnr.GameEngine.BaseCollider {
    /**
     * Create a new collider
     * @param {string} name 
     * @param {spnr.Vector} localPosition 
     * @param {number} radius 
     */
    constructor(name, localPosition, radius) {
        super(name, spnr.GameEngine.colliderTypes.circle, localPosition, 0);

        this.radius = radius;
    }

    /**
     * Currently the only collision method implemented.
     * @param {spnr.GameEngine.BaseCollider} collider 
     * @returns {boolean}
     */
    isTouching(collider) {
        switch(collider.type) {
            case spnr.GameEngine.colliderTypes.circle:
                var distSq = spnr.v.distSq(this.globalPosition, collider.globalPosition);
                return (distSq < this.radius ** 2 + collider.radius ** 2);
        }
    }
}

/**
 * Particle in a particle effect. Designed to be used by spnr.GameEngine.ParticleEffect
 * @class
 * @extends {spnr.GameEngine.DrawableEntity}
 */
spnr.GameEngine.Particle = class extends spnr.GameEngine.DrawableEntity {
    /**
     * Create a new particle.
     * @param {string} name 
     * @param {spnr.Vector} localPosition 
     * @param {number} localAngle 
     * @param {spnr.GameEngine.Texture} texture 
     * @param {spnr.Vector} size 
     * @param {spnr.Vector} velocity 
     * @param {number} timeToLive
     * @param {object} effectorStrengths - see {@link spnr.GameEngine.ParticleEffect spnr.GameEngine.ParticleEffect} for info about this
     */
    constructor(name, localPosition, localAngle, texture, size,
            velocity, timeToLive, effectorStrengths) {
        super(name, localPosition, localAngle, texture, size);
        this.addTag('Particle');
        this.velocity = spnr.v.copy(velocity);
        this.timeToLive = timeToLive;
        this.effectorStrengths = effectorStrengths;
        this.airFrictionMult = 0.001;

        this.acceleration = spnr.v(0, 0);
    }

    /**
     * Feel the effector forces
     * @private
     */
    feelEffectors() {
        if (this.effectorStrengths.gravity) {
            var forceVector = spnr.v(0, this.effectorStrengths.gravity);
            spnr.v.rotate(forceVector, this.effectorStrengths.gravityDirection);
            spnr.v.add(this.acceleration, forceVector);
        }
        if (this.effectorStrengths.airFriction) {
            var dragAmount = spnr.v.mag(this.velocity);
            dragAmount *= dragAmount;
            dragAmount *= this.effectorStrengths.airFriction *
                this.airFrictionMult;

            var dragVector = spnr.v.copy(this.velocity);
            spnr.v.normalize(dragVector);
            spnr.v.mult(dragVector, dragAmount);
            spnr.v.sub(this.acceleration, dragVector);
        }
    }

    /**
     * Do not override, contains the actual logic of the particles
     * @private
     */
    update() {
        if (this.timeToLive < 0) this.parent.removeChild(this);

        if (this.effectorStrengths) this.feelEffectors();

        spnr.v.mult(this.acceleration, spnr.GameEngine.deltaTime);
        spnr.v.add(this.velocity, this.acceleration);

        var distToMove = spnr.v.copyMult(this.velocity, spnr.GameEngine.deltaTime);
        spnr.v.add(this.localPosition, distToMove);

        spnr.v.makeZero(this.acceleration);

        this.timeToLive -= spnr.GameEngine.deltaTime;
    }
}

/**
 * Particle effect class.
 * 
 *  Example of emitterData:
 * ```
 *  {
 *      particleTemplate : <a particle template>, (see below)
 *      shape : <'circle'||'arc'||'line'>,
 *      amount : <number>,
 *      delay : <number>, (in seconds)
 *      interval : <number>, (in seconds)
 *      minAngle : <number>, (only needed for shape:'arc')
 *      maxAngle : <number> (only needed for shape:'arc')
 *  }
 * ```
 *  Example of particleTemplate:
 * ```
 *  {
 *      texture : <spnr.GameEngine.Texture>,
 *      tint : <a hex color>, (optional, defaults to no tint)
 *      minSize : <spnr.v>,
 *      maxSize : <spnr.v>,
 *      minSpeed : <number>,
 *      maxSpeed : <number>,
 *      minTimeToLive : <number>, (seconds)
 *      maxTimeToLive : <number>, (seconds)
 *      effectorStrengths : {
 *          airFriction : <number>
 *          gravity : <number>,
 *          gravityDirection : <number> (radians)
 *      }
 *  }
 * 
 * ```
 * 
 * @class
 * @extends {spnr.GameEngine.Entity}
 */
spnr.GameEngine.ParticleEffect = class extends spnr.GameEngine.Entity {
    /**

    */
    /**
     * Create a new particle effect.
     * @param {string} name 
     * @param {spnr.Vector} localPosition 
     * @param {number} localAngle 
     * @param {object} emitterData 
     * @param {boolean} [looping=false] 
     * @param {boolean} [deleteWhenFinished=false] 
     */
    constructor(name, localPosition, localAngle, emitterData, looping=false,
        deleteWhenFinished=false) {
        super(name, localPosition, localAngle);
        this.emitterData = emitterData;
        this.looping = looping;
        this.deleteWhenFinished = deleteWhenFinished;


        this.timer = 0;
        this.playing = false;
        this.particlesRemaining = 0;
        this.hasPlayed = false;
    }

    /**
     * Start the effect playing
     */
    play() {
        // Only remove the children if the effect is non-looping,
        // as removing them spoils the loop illusion
        if (! this.looping) this.removeChildren();
        
        this.timer = this.emitterData.delay || 0;
        this.playing = true;
        this.particlesRemaining = this.emitterData.amount;
    }

    /**
     * Internal method to add a particle
     * @private
    */
    addParticle() {
        var particleTemplate = this.emitterData.particleTemplate;
        if (particleTemplate.tint === undefined) particleTemplate.tint = 0xffffff;
        var position = spnr.v(0, 0);
        var size = spnr.v.random(particleTemplate.minSize,
            particleTemplate.maxSize);
        var timeToLive = spnr.randflt(particleTemplate.minTimeToLive,
            particleTemplate.maxTimeToLive);

        var angle = 0;
        var velocity = spnr.v(0, 0);
        switch (this.emitterData.shape) {
            case 'circle':
                angle = spnr.randflt(0, spnr.PI * 2);
                velocity = spnr.v(0, spnr.randflt(particleTemplate.minSpeed,
                    particleTemplate.maxSpeed));
                spnr.v.rotate(velocity, angle);
                break;
            case 'arc':
                angle = spnr.randflt(this.emitterData.minAngle, this.emitterData.maxAngle);
                velocity = spnr.v(0, spnr.randflt(particleTemplate.minSpeed,
                    particleTemplate.maxSpeed));
                spnr.v.rotate(velocity, angle);
                break;
            case 'line':
                void 0; // do nothing - line isn't planned yet
                break;
        }

        var particle = new spnr.GameEngine.Particle('particle', position, angle,
            particleTemplate.texture, size,
            velocity, timeToLive, particleTemplate.effectorStrengths);
        particle.setTint(particleTemplate.tint);
        this.particlesRemaining --;
        this.addChild(particle);

        // If effect is instantaneous, then don't wait for next frame
        if (this.emitterData.interval == 0 && this.particlesRemaining > 0) {
            this.addParticle();
        }
    }

    /**
     * Do not override, contains the actual logic
     * @private
     */
    update() {
        if (this.playing) {
            // Everything in here is run in the nominal playing state
            if (this.particlesRemaining > 0) {
                this.timer -= spnr.GameEngine.deltaTime;
                if (this.timer < 0) {
                    this.addParticle();
                    this.timer = this.emitterData.interval;
                }
            }
            // Everything in here is run on the frame where playing finishes
            else {
                this.hasPlayed = true;

                // Make it loop
                if (this.looping) this.play()
                // Otherwise just quit
                else this.playing = false;
            }
        }

        // Delete when finished
        if (this.deleteWhenFinished && this.children.length == 0
            && this.hasPlayed) {
            this.parent.removeChild(this);
        }
    }
}

/**
 * Class that shows the current frame rate of the engine.
 * Mainly useful for performance purposes but you can also include it in a finished game.
 * @class
 * @extends {spnr.GameEngine.Label}
 */
spnr.GameEngine.FrameRateDisplay = class extends spnr.GameEngine.Label {
    /**
     * 
     * @param {string} name 
     * @param {spnr.GameEngine.FrameRateDisplayCorner} [corner] - what corner of the screen to display in
     * @param {spnr.Vector} [padding=spnr.v(20, 20)] - padding from edge of screen
     * @param {number} [updateInterval=5] - update every n frames
     * @param {number} [decimalPlaces=0] - round fps values to this many decimal places
     */
    constructor(name, corner=spnr.GameEngine.FrameRateDisplayCorner.bottomRight, padding=spnr.v(20, 20), updateInterval=5, decimalPlaces=0) {
        super(name, '', spnr.v(0, 0), spnr.PI);
        this.useDefaultTextFormat();
        this.corner = corner;
        this.padding = padding;
        this.updateInterval = updateInterval;
        this.decimalPlaces = decimalPlaces;

        this.frameCount = 0;
        this.runningTotal = 0;
    }

    /**
     * Use the default format
     */
    useDefaultTextFormat() {
        this.setTextFormat({
            fill: '#ffffff',
            fontSize: 28,
            stroke: '#000000',
            strokeThickness: 1
        })
    }

    internalUpdate() {
        this.frameCount ++;
        this.runningTotal += 1 / spnr.GameEngine.deltaTime;
        if (this.frameCount % this.updateInterval == 0) {
            var average = this.runningTotal / this.updateInterval;
            this.setText(spnr.round(average, this.decimalPlaces).toFixed(this.decimalPlaces));
            this.runningTotal = 0;
        }

        switch (this.corner) {
            case spnr.GameEngine.FrameRateDisplayCorner.topLeft:
                this.setLocalPosition(this.padding);
                break;
            case spnr.GameEngine.FrameRateDisplayCorner.topRight:
                this.setLocalPosition(spnr.v(spnr.GameEngine.canvasSize.x - this.padding.x, 0));
                break;
            case spnr.GameEngine.FrameRateDisplayCorner.bottomLeft:
                this.setLocalPosition(spnr.v(0, spnr.GameEngine.canvasSize.y - this.padding.y));
                break;
            case spnr.GameEngine.FrameRateDisplayCorner.bottomRight:
                this.setLocalPosition(spnr.v.copySub(spnr.GameEngine.canvasSize, this.padding));
                break;
        }
        super.internalUpdate();
    }
}

/**
 * @memberof spnr.GameEngine
 * @readonly
 * @enum
 */
spnr.GameEngine.FrameRateDisplayCorner = {
    topLeft: 0,
    topRight: 0,
    bottomLeft: 0,
    bottomRight: 0
};
spnr.obj.toEnum(spnr.GameEngine.FrameRateDisplayCorner);

/**
 * Abstract canvas sizer
 * @class
 */
spnr.GameEngine.AbstractCanvasSizer = class {
    /**
     * Method called to update the canvas size
     * @virtual
     */
    updateCanvasSize() {
        throw Error('Method "calcCanvasSize" not overwritten in class ' + 
            'extending from AbstractCanvasSizer');
    }
}

/**
 * Fixed aspect ratio canvas sizer that fills the page by scaling the canvas instead of expanding it.
 * @class
 * @extends {spnr.GameEngine.AbstractCanvasSizer}
 */
spnr.GameEngine.FixedARCanvasSizer = class extends spnr.GameEngine.AbstractCanvasSizer {
    /**
     * Create a new sizer. See properties for descriptions of arguments.
     * @param {spnr.Vector} targetSize 
     * @param {spnr.Vector} padding 
     * @param {number} [minScale=0] 
     * @param {number} [maxScale=Infinity] 
     */
    constructor(targetSize, padding, minScale=0, maxScale=Infinity) {
        super();
        /**
         * Size of the canvas if the scale was 1. Use a sensible value like 800x500
         * @member
         * @type {spnr.Vector}
         */
        this.targetSize = spnr.v.copy(targetSize);
        /**
         * Padding between the canvas and the edge of the page. If the canvas is not aligned with css, will be all on the bottom right.
         * @member
         * @type {spnr.Vector}
         */
        this.padding = spnr.v.copy(padding);
        /**
         * Minimum scale of the canvas. If this value is too large, canvas may not fit on smaller screens.
         * @member
         * @type {number}
         */
        this.minScale = minScale;
        /**
         * Maximum scale of the canvas. If this value is too small, canvas may not expand fully on large screens.
         * @member
         * @type {number}
         */
        this.maxScale = maxScale;
    }

    /**
     * @private
     */
    updateCanvasSize() {
        var targetAspectRatio = this.targetSize.x / this.targetSize.y;
        var availableArea = spnr.v.copySub(spnr.dom.viewportSize(), this.padding);
    
        var availableAspectRatio = availableArea.x / availableArea.y;
    
        // If the target is 'wider' than the window
        if (targetAspectRatio > availableAspectRatio) {
            var sizeMult = availableArea.x / this.targetSize.x;
        }
        // If the target is 'taller' than the window
        else {
            var sizeMult = availableArea.y / this.targetSize.y;
        }
        spnr.GameEngine.setCanvasSize(this.targetSize);
        spnr.GameEngine.setGlobalScale(sizeMult);
    }
}

/**
 * Canvas sizer that aims to fill the page as much as possible. Doesn't scale the canvas but instead just expands it.
 * Does not maintain aspect ratio
 * @class
 * @extends {spnr.GameEngine.AbstractCanvasSizer}
 */
spnr.GameEngine.FillPageCanvasSizer = class extends spnr.GameEngine.AbstractCanvasSizer {
    /**
     * Create a new sizer
     * @param {spnr.Vector} padding 
     */
    constructor(padding) {
        super();
        /**
         * Padding between the edge of the canvas and the page. Used because having no padding will generally overflow in many browsers.
         * If the canvas isn't aligned with css, the padding is all on the bottom and right.
         * @type {spnr.Vector}
         * @member
         */
        this.padding = spnr.v.copy(padding);
    }

    /**
     * @private
     */
    updateCanvasSize() {
        var size = spnr.v.copySub(spnr.dom.viewportSize(), this.padding);
        spnr.GameEngine.setGlobalScale(1);
        spnr.GameEngine.setCanvasSize(size);
    }
}

// appended at end of compiled spnr (when compiled to .mjs)
// handles exporting

export { spnr };
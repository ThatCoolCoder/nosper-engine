export default class ParseContext {
    // Little helper for going over arrays or strings or other indexable types,
    // so that we don't have to write cursor movement functions 5 times.

    constructor(source) {
        this.source = source;
        this.length = this.source.length;
        this.crntIndex = 0;
        this.crntItem = this.source[this.crntIndex];
    }

    get finished() {
        return this.crntIndex >= this.length;
    }

    get remaining() {
        return this.source.slice(this.crntIndex, this.source.length);
    }

    next(amount=1) {
        this.crntIndex += amount;
        this.crntItem = this.source[this.crntIndex];
    }

    previous(amount=1) {
        this.crntIndex -= amount;
        this.crntItem = this.source[this.crntIndex];
    }

    peekNext(amount=1) {
        return this.source[this.crntIndex + amount];
    }

    peekPrevious(amount=1) {
        return this.source[this.crntIndex - amount];
    }
}
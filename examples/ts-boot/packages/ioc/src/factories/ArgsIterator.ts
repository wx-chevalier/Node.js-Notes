import { Metadate } from '../metadatas';
import { lang, isMetadataObject } from '../utils';


/**
 * arg checker.
 *
 * @export
 * @interface CheckExpress
 * @template T
 */
export interface CheckExpress<T extends Metadate> {
    /**
     * arg matched or not.
     *
     * @param {*} arg
     * @param {any[]} [args]
     * @returns {boolean}
     * @memberof CheckExpress
     */
    match(arg: any, args?: any[]): boolean;
    /**
     * arg is meatdata or not.
     *
     * @param {*} arg
     * @returns {boolean}
     * @memberof CheckExpress
     */
    isMetadata?(arg: any): boolean;
    /**
     * set arg to metadata.
     *
     * @param {T} metadata
     * @param {*} arg
     * @memberof CheckExpress
     */
    setMetadata(metadata: T, arg: any): void
}

/**
 * args iterator.s
 *
 * @export
 * @class ArgsIterator
 */
export class ArgsIterator {
    private idx: number;
    private metadata: Metadate;
    constructor(protected args: any[]) {
        this.idx = -1;
        this.metadata = null;
    }

    isCompeted(): boolean {
        return this.idx >= this.args.length;
    }

    end() {
        this.idx = this.args.length;
    }

    next<T>(express: CheckExpress<T>) {
        this.idx++;
        if (this.isCompeted()) {
            return null;
        }

        let arg = this.args[this.idx];
        if (express.isMetadata && express.isMetadata(arg)) {
            this.metadata = Object.assign(this.metadata || {}, arg);
            this.end();
        } else if (express.match(arg, this.args)) {
            this.metadata = this.metadata || {};
            express.setMetadata(this.metadata as T, arg);
        } else if (isMetadataObject(arg)) { // when match failed then check is base metadata.
            this.metadata = Object.assign(this.metadata || {}, arg);
            this.end();
        } else {
            this.end();
        }
    }

    getArgs() {
        return this.args;
    }

    getMetadata() {
        return this.metadata;
    }
}


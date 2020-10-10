import { isString } from './utils';
import { Token } from './types';
import { Registration } from './Registration';


/**
 * inject reference.
 *
 * @export
 * @class InjectReference
 * @extends {Registration<T>}
 * @template T
 */
export class InjectReference<T> extends Registration<T> {
    constructor(provideType: Token<T>, private target: Token) {
        super(provideType, '');
    }

    protected init(provideType: Token<T>) {
        this.classType = this.format(provideType);
    }

    /**
     * to string.
     *
     * @returns {string}
     * @memberof Registration
     */
    toString(): string {
        let key = super.toString();
        let target = this.format(this.target)
        return `Ref ${key} for ${target}`;
    }
}

/**
 * is inject reference token or not.
 *
 * @export
 * @template T
 * @param {*} target
 * @returns {target is InjectReference<T>}
 */
export function isInjectReference<T>(target: any): target is InjectReference<T> {
    if (!target) {
        return false;
    }
    return target instanceof InjectReference || (isString(target) && /^Ref\s+[\w\{\}]+\sfor/.test(target));
}

import { Token, ProvideToken } from '../types';
import { Registration } from '../Registration';
import { isSymbol, isString, isClassType } from './lang';

/**
 * check target is token or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Token}
 */
export function isToken(target: any): target is Token {
    if (!target) {
        return false;
    }
    if (isClassType(target)) {
        return true;
    }
    return isProvideToken(target);
}

/**
 * check target is provide token or not.
 *
 * @export
 * @param {*} target
 * @returns {target is ProvideToken}
 */
export function isProvideToken(target: any): target is ProvideToken<any> {
    if (!target) {
        return false;
    }
    if (isString(target) || isSymbol(target) || (target instanceof Registration)) {
        return true
    }
    return false
}

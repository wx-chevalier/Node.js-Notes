import { ObjectMap, isObject, isFunction, isObservable } from '@tsdi/ioc';
import { Stream } from 'stream';

/**
 * transform interface.
 *
 * @export
 * @interface ITransform
 * @extends {ObjectMap}
 * @extends {NodeJS.ReadWriteStream}
 */
export interface ITransform extends ObjectMap, NodeJS.ReadWriteStream {
    /**
     * set the stream source as origin.
     *
     * @type {boolean}
     * @memberof ITransform
     */
    changeAsOrigin?: boolean;
}


/**
 *check target is transform or not.
 *
 * @export
 * @param {*} target
 * @returns {boolean}
 */
export function isTransform(target: any): boolean {
    return (isObject(target) === true) && (target instanceof Stream || (isFunction(target.pipe) && !isObservable(target)));
}

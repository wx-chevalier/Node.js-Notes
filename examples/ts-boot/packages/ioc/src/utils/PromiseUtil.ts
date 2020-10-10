import { isFunction } from './lang';
import { Express } from '../types';


/**
 * defer
 *
 * @export
 * @class Defer
 * @template T
 */
export class Defer<T> {
    static create<T>(then?: (val: T) => T | PromiseLike<T>): Defer<T> {
        let defer = new Defer<T>();
        if (then) {
            defer.promise = defer.promise.then(then);
            return defer;
        } else {
            return defer;
        }
    }
    /**
     * promise.
     *
     * @type {Promise<T>}
     * @memberof Defer
     */
    promise: Promise<T>
    /**
     * resolve.
     *
     * @memberof Defer
     */
    resolve: (value?: T | PromiseLike<T>) => void;
    /**
     * reject.
     *
     * @memberof Defer
     */
    reject: (reason?: any) => void;

    constructor() {
        this.promise = new Promise<T>((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }
}

/**
 * promise util.
 */
export namespace PromiseUtil {

    /**
     * create defer.
     *
     * @export
     * @template T
     * @param {((val: T) => T | PromiseLike<T>)} [then]
     * @returns {Defer<T>}
     */
    export function defer<T>(then?: (val: T) => T | PromiseLike<T>): Defer<T> {
        return Defer.create(then);
    }

    /**
     * foreach opter for promises.
     *
     * @export
     * @template T
     * @param {((T | PromiseLike<T> | ((value: T) => T | PromiseLike<T>))[])} promises
     * @param {Express<T, any>} express
     * @param {T} [defVal]
     * @returns
     */
    export function forEach<T>(promises: (T | PromiseLike<T> | ((value: T) => T | PromiseLike<T>))[], express: Express<T, any>, defVal?: T) {
        let defer = new Defer<string>();
        let pf = Promise.resolve<T>(defVal);
        let length = promises ? promises.length : 0;

        if (length) {
            promises.forEach((p, idx) => {
                pf = pf.then(v => isFunction(p) ? p(v) : p)
                    .then(data => {
                        if (express(data) === false) {
                            defer.resolve('complete');
                            return Promise.reject<T>('complete');
                        } else if (idx === length - 1) {
                            defer.resolve('complete');
                            return Promise.reject<T>('complete');
                        }
                        return data;
                    });
            });
            pf.catch(err => {
                return err;
            });
        } else {
            defer.reject('array empty.');
        }
        return defer.promise;
    }

    /**
     * run promise step by step.
     *
     * @export
     * @template T
     * @param {((T | PromiseLike<T> | ((value: T) => T | PromiseLike<T>))[])} promises
     * @returns
     */
    export function step<T>(promises: (T | PromiseLike<T> | ((value: T) => T | PromiseLike<T>))[]) {
        let result = Promise.resolve<T>(null);
        promises.forEach(p => {
            result = result.then(v => isFunction(p) ? p(v) : p);
        });
        return result;
    }

    /**
     * find first validate value from promises.
     *
     * @export
     * @template T
     * @param {(...(T | PromiseLike<T> | ((value: T) => T | PromiseLike<T>))[])} promises
     * @param {Express<T, boolean>} validate
     * @returns
     */
    export function find<T>(promises: (T | PromiseLike<T> | ((value: T) => T | PromiseLike<T>))[], filter: Express<T, boolean>, defVal?: T) {
        let defer = new Defer<T>();
        forEach(promises, val => {
            if (filter(val)) {
                defer.resolve(val);
                return false;
            }
            return true;
        }, defVal)
            .then(() => defer.resolve(null))
            .catch(() => {
                defer.resolve(null)
            });
        return defer.promise;
    }

    /**
     *  action handle.
     */
    export type ActionHandle<T = any> = (ctx: T, next?: () => Promise<void>) => Promise<void>;

    /**
     * run action in chain.
     *
     * @export
     * @template T
     * @param {ActionHandle<T>[]} handles
     * @param {T} ctx
     * @param {() => Promise<void>} [next]
     * @returns {Promise<void>}
     */
    export function runInChain<T>(handles: ActionHandle<T>[], ctx: T, next?: () => Promise<void>): Promise<void> {
        let index = -1;
        return dispatch(0);
        function dispatch(idx: number): Promise<any> {
            if (idx <= index) {
                return Promise.reject('in chain next called mutiple times.');
            }
            index = idx;
            let handle = idx < handles.length ? handles[idx] : null;
            if (idx === handles.length) {
                handle = next;
            }
            if (!handle) {
                return Promise.resolve();
            }
            try {
                return Promise.resolve(handle(ctx, dispatch.bind(null, idx + 1)));
            } catch (err) {
                return Promise.reject(err);
            }
        }
    }

}

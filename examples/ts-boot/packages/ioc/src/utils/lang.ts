// use core-js in browser.
import { ObjectMap, Type, AbstractType, Token, ClassType } from '../types';


declare let process: any;

/**
 * lang utils
 */
export namespace lang {
    /**
     * assert param is right or not.
     *
     * @export
     * @param {*} param
     * @param {(string | Function)} msg
     */
    export function assert(param: any, msg: string | Function) {
        if (isNullOrUndefined(param)) {
            throw new Error(isFunction(msg) ? msg(param) : msg);
        }
    }
    /**
     * check assert param invalid by express
     *
     * @export
     * @param {(boolean | (() => boolean))} express
     * @param {(string | Function)} msg
     */
    export function assertExp(express: boolean | (() => boolean), msg: string | Function) {
        if (!(isFunction(express) ? express() : express)) {
            throw new Error(isFunction(msg) ? msg() : msg);
        }
    }

    /**
     * create an new object from target object omit some field.
     *
     * @export
     * @param {ObjectMap} target
     * @param {...string[]} fields
     * @returns {*}
     */
    export function omit(target: ObjectMap, ...fields: string[]): any {
        if (isObject(target)) {
            let result: any = {};
            Object.keys(target).forEach(key => {
                if (fields.indexOf(key) < 0) {
                    result[key] = target[key];
                }
            });
            return result;
        } else {
            return target;
        }
    }

    /**
     * object has field or not.
     *
     * @export
     * @param {ObjectMap} target
     * @returns
     */
    export function hasField(target: ObjectMap) {
        return Object.keys(target).length > 0;
    }

    /**
     * for in opter for object or array.
     *
     * @export
     * @template T
     * @param {(ObjectMap<T> | T[])} target
     * @param {(item: T, idx?: number|string) => void|boolean} iterator
     */
    export function forIn<T = any>(target: ObjectMap<T> | T[], iterator: (item: T, idx?: number | string) => void | boolean) {
        if (isArray(target)) {
            target.some((it, idx) => iterator(it, idx) === false);
        } else if (isObject(target)) {
            Object.keys(target).some((key, idx) => iterator(target[key], key) === false);
        }
    }

    /**
     * find
     *
     * @template T
     * @param {(ObjectMap<T> | T[])} target
     * @param {((item: T, idx?: number | string) => boolean)} express
     */
    export function find<T>(target: ObjectMap<T> | T[], express: (item: T, idx?: number | string) => boolean) {
        let item: T;
        forIn(target, (it, idx) => {
            if (!item) {
                if (express(it, idx)) {
                    item = it;
                    return false;
                }
                return true;
            } else {
                return true;
            }
        })
    }


    /**
     * first.
     *
     * @export
     * @template T
     * @param {T[]} list
     * @returns {T}
     */
    export function first<T>(list: T[]): T {
        if (isArray(list) && list.length) {
            return list[0];
        }
        return null;
    }

    /**
     * last.
     *
     * @export
     * @template T
     * @param {T[]} list
     * @returns {T}
     */
    export function last<T>(list: T[]): T {
        if (isArray(list) && list.length) {
            return list[list.length - 1];
        }
        return null;
    }

    /**
     * get class annations.
     *
     * @export
     * @param {ClassType} target
     * @returns
     */
    export function getClassAnnations(target: ClassType) {
        return isFunction(target.getClassAnnations) ? target.getClassAnnations() : target.classAnnations;
    }

    /**
     * target has class annations or not.
     *
     * @export
     * @param {ClassType} target
     * @returns {boolean}
     */
    export function hasClassAnnations(target: ClassType): boolean {
        if (isFunction(target.getClassAnnations)) {
            return true;
        }
        return target.classAnnations && isString(target.classAnnations.name) && target.classAnnations.name.length > 0;
    }


    /**
     * get class of object.
     *
     * @export
     * @param {*} target
     * @returns {Type}
     */
    export function getClass(target: any): Type {
        if (isNullOrUndefined(target)) {
            return null;
        }
        if (isClass(target)) {
            return target;
        }
        return target.constructor || target.prototype.constructor;
    }

    /**
     * get class name.
     *
     * @export
     * @param {AbstractType} target
     * @returns {string}
     */
    export function getClassName(target: any): string {
        let classType = isFunction(target) ? target : getClass(target);
        if (!isFunction(classType)) {
            return '';
        }
        if (/^[a-z]$/.test(classType.name)) {
            let classAnnations = getClassAnnations(classType);
            return classAnnations ? classAnnations.name : classType.name;
        }
        return classType.name;
    }

    /**
     * get target type parent class.
     *
     * @export
     * @param {ClassType} target
     * @returns {ClassType}
     */
    export function getParentClass(target: ClassType): ClassType {
        let p = Reflect.getPrototypeOf(target.prototype);
        return isClass(p) ? p : p.constructor as ClassType;
    }

    /**
     * get all parent class in chain.
     *
     * @export
     * @param {ClassType} target
     * @returns {ClassType[]}
     */
    export function getClassChain(target: ClassType): ClassType[] {
        let types: ClassType[] = [];
        forInClassChain(target, type => {
            types.push(type);
        });
        return types;
    }

    /**
     * iterate base classes of target in chain. return false will break iterate.
     *
     * @export
     * @param {Type} target
     * @param {(token: Type) => any} express
     */
    export function forInClassChain(target: ClassType, express: (token: ClassType) => any): void {
        while (isClassType(target) && target !== Object) {
            if (express(target) === false) {
                break;
            }
            target = getParentClass(target);
        }
    }

    /**
     * target is extends class of baseClass or not.
     *
     * @export
     * @param {Token} target
     * @param {(ClassType | ((type: ClassType) => boolean))} baseClass
     * @returns {boolean}
     */
    export function isExtendsClass(target: Token, baseClass: ClassType | ((type: ClassType) => boolean)): boolean {
        let isExtnds = false;
        if (isClassType(target)) {
            forInClassChain(target, t => {
                if (isClassType(baseClass)) {
                    isExtnds = t === baseClass;
                } else if (isFunction(baseClass)) {
                    isExtnds = baseClass(t);
                }
                return !isExtnds;
            });
        }
        return isExtnds;
    }



    /**
    *  action handle.
    */
    export type IAction<T = any> = (ctx: T, next?: () => void) => any;

    /**
     * execute action in chain.
     *
     * @export
     * @template T
     * @param {ActionHandle<T>[]} handles
     * @param {T} ctx
     * @param {() => void} [next]
     */
    export function execAction<T>(handles: IAction<T>[], ctx: T, next?: () => void): void {
        let index = -1;
        function dispatch(idx: number): any {
            if (idx <= index) {
                return Promise.reject('next called mutiple times.');
            }
            index = idx;
            let handle = idx < handles.length ? handles[idx] : null;
            if (idx === handles.length) {
                handle = next;
            }
            if (!handle) {
                return;
            }
            try {
                return handle(ctx, dispatch.bind(null, idx + 1));
            } catch (err) {
                throw err;
            }
        }
        dispatch(0);
    }

}


/**
 * check target is function or not.
 *
 * @export
 * @param {*} target
 * @returns
 */
export function isFunction(target: any): target is Function {
    if (!target) {
        return false;
    }
    return typeof target === 'function';
}

/**
 * check Abstract class with @Abstract or not
 *
 * @export
 * @param {*} target
 * @returns {target is AbstractType}
 */
export function isAbstractClass(target: any): target is AbstractType {
    return classCheck(target) && Reflect.hasOwnMetadata('@Abstract', target);
}


/**
 * check target is class or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Type}
 */
export function isClass(target: any): target is Type {
    return classCheck(target) && (!Reflect.hasOwnMetadata('@Abstract', target))
}

export function isClassType(target: any): target is ClassType {
    return classCheck(target);
}

function classCheck(target: any): boolean {
    if (!isFunction(target)) {
        return false;
    }

    if (target.prototype) {
        if (!target.name || target.name === 'Object') {
            return false;
        }

        let type = target as Type;

        // for uglify
        if (/^[a-z]$/.test(type.name)) {
            if (lang.hasClassAnnations(type)) {
                return true;
            } else {
                return false;
            }
        } else {
            if (lang.hasClassAnnations(type)) {
                return true;
            }
            if (!/^[A-Z@]/.test(target.name)) {
                return false;
            }
        }

        // for IE 8, 9
        if (!isNodejsEnv() && /MSIE [6-9]/.test(navigator.userAgent)) {
            return true;
        }
        try {
            target.arguments && target.caller;
            return false;
        } catch (e) {
            return true;
        }
    }

    return false;
}

/**
 * is run in nodejs or not.
 *
 * @export
 * @returns {boolean}
 */
export function isNodejsEnv(): boolean {
    return (typeof process !== 'undefined') && (typeof process.versions.node !== 'undefined')
}

/**
 * is target promise or not. now check is es6 Promise only.
 *
 * @export
 * @param {*} target
 * @returns {target is Promise<any>}
 */
export function isPromise(target: any): target is Promise<any> {
    if (!target) {
        return false;
    }
    let type = target.constructor || target.prototype.constructor;
    if (type && type.name === 'Promise') {
        return true;
    }
    return false;
}

/**
 * is target rxjs observable or not.
 *
 * @export
 * @param {*} target
 * @returns {boolean}
 */
export function isObservable(target: any): boolean {
    if (!target && !isObject(target)) {
        return false;
    }
    let type = target.constructor || target.prototype.constructor;
    if (type && type.name === 'Observable') {
        return true;
    }
    return false;
}

/**
 * is target base object or not.
 * eg. {}, have not self constructor;
 * @export
 * @param {*} target
 * @returns {target is Promise<any>}
 */
export function isBaseObject(target: any): target is object {
    if (!target) {
        return false;
    }
    if (target.constructor && target.constructor.name === 'Object') {
        return true;
    }
    return false;
}

/**
 * is metadata object or not.
 *
 * @export
 * @param {*} target
 * @param {...(string|string[])[]} props
 * @returns {boolean}
 */
export function isMetadataObject(target: any, ...props: (string | string[])[]): boolean {
    if (!isBaseObject(target)) {
        return false;
    }
    if (props.length) {
        return Object.keys(target).some(n => props.some(ps => isString(ps) ? ps === n : ps.indexOf(n) > 0));
    }

    return true;
}

/**
 * check object is class metadata or not.
 *
 * @export
 * @param {*} target
 * @param {...(string | string[])[]} extendsProps
 * @returns {boolean}
 */
export function isClassMetadata(target, ...extendsProps: (string | string[])[]): boolean {
    return isMetadataObject(target, ...extendsProps.concat(['singleton', 'provide', 'alias', 'type']));
}

/**
 * check object is property metadata or not.
 *
 * @export
 * @param {*} target
 * @param {...(string | string[])[]} extendsProps
 * @returns {boolean}
 */
export function isProvideMetadata(target, ...extendsProps: (string | string[])[]): boolean {
    return isMetadataObject(target, ...extendsProps.concat(['type', 'provider']));
}

/**
 * check target is string or not.
 *
 * @export
 * @param {*} target
 * @returns {target is string}
 */
export function isString(target: any): target is string {
    return typeof target === 'string';
}

/**
 * check target is boolean or not.
 *
 * @export
 * @param {*} target
 * @returns {target is boolean}
 */
export function isBoolean(target: any): target is boolean {
    return typeof target === 'boolean' || (target === true || target === false);
}

/**
 * check target is number or not.
 *
 * @export
 * @param {*} target
 * @returns {target is number}
 */
export function isNumber(target: any): target is number {
    return typeof target === 'number';
}

/**
 * check target is undefined or not.
 *
 * @export
 * @param {*} target
 * @returns {target is undefined}
 */
export function isUndefined(target: any): target is undefined {
    return typeof target === 'undefined' || target === undefined;
}

/**
 * check target is unll or not.
 *
 * @export
 * @param {*} target
 * @returns {target is null}
 */
export function isNull(target: any): target is null {
    return target === null;
}

/**
 * is target null or undefined.
 *
 * @export
 * @param {*} target
 * @returns {boolean}
 */
export function isNullOrUndefined(target): boolean {
    return isNull(target) || isUndefined(target);
}

/**
 * check target is array or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Array<any>}
 */
export function isArray(target: any): target is Array<any> {
    return Array.isArray(target);
}

/**
 * check target is object or not.
 *
 * @export
 * @param {*} target
 * @returns {target is object}
 */
export function isObject(target: any): target is object {
    if (isNullOrUndefined(target)) {
        return false;
    }
    let type = typeof target;
    return type === 'object' || type === 'function';
}

/**
 * is custom class type instance or not.
 *
 * @export
 * @param {*} target
 * @returns {boolean}
 */
export function isTypeObject(target: any): boolean {
    if (isNullOrUndefined(target)) {
        return false;
    }
    if (typeof target !== 'object') {
        return false;
    }
    let type = lang.getClass(target);
    if (isBaseType(type)) {
        return false;
    }
    return true;
}

/**
 * check target is date or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Date}
 */
export function isDate(target: any): target is Date {
    return isObject(target) && target instanceof Date;
}

/**
 * check target is symbol or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Symbol}
 */
export function isSymbol(target: any): target is Symbol {
    return typeof target === 'symbol' || (isObject(target) && /^Symbol\(/.test(target.toString()));
}

/**
 * check target is regexp or not.
 *
 * @export
 * @param {*} target
 * @returns {target is RegExp}
 */
export function isRegExp(target: any): target is RegExp {
    return target && target instanceof RegExp;
}

/**
 * is base type or not.
 *
 * @export
 * @param {*} target
 * @returns {boolean}
 */
export function isBaseType(target: ClassType): boolean {
    if (!isFunction(target)) {
        return false;
    }
    return target === Object
        || target === Boolean
        || target === String
        || target === Number
        || target === Date
        || target === Array;
}

export function isBaseValue(target: any): boolean {
    return isBaseType(lang.getClass(target));
}


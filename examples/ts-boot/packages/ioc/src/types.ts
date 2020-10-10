import { Registration } from './Registration';
import { IIocContainer } from './IIocContainer';
import { ProviderTypes } from './providers';

/**
 * module types.
 */
export type Modules = Type | ObjectMap;

/**
 * load modules in base on an path.
 *
 * @export
 * @interface PathModules
 */
export interface PathModules {
    /**
     * fire express base on the root path.
     *
     * @type {string}
     * @memberof LoadOptions
     */
    basePath?: string;
    /**
     * in nodejs:
     * script files match express.
     * see: https://github.com/isaacs/node-glob
     *
     * in browser:
     * script file url.
     * @type {(string | string[])}
     * @memberof BuilderOptions
     */
    files?: string | string[];

    /**
     * modules
     *
     * @type {((Modules | string)[])}
     * @memberof AsyncLoadOptions
     */
    modules?: (Modules | string)[];
}

/**
 * load module type.
 */
export type LoadType = Modules | string | PathModules;

/**
 * class type.
 */
export type ClassType<T = any> = Type<T> | AbstractType<T>;
/**
 * symbol type
 */
export type SymbolType<T = any> = ClassType<T> | string | symbol;

/**
 * factory tocken.
 */
export type Token<T = any> = Registration<T> | SymbolType<T>;

/**
 * provide token
 */
export type ProvideToken<T> = Registration<T> | string | symbol;

/**
 * instance factory.
 */
export type InstanceFactory<T = any> = (...providers: ProviderTypes[]) => T;

/**
 * to instance via container.
 */
export type ToInstance<T = any> = (container?: IIocContainer, ...providers: ProviderTypes[]) => T;

/**
 * Factory of Token
 */
export type Factory<T> = T | Type<T> | ToInstance<T>;

/**
 * object map.
 *
 * @export
 * @interface ObjectMap
 * @template T
 */
export interface ObjectMap<T = any> {
    [index: string]: T;
}

/**
 * class Annations
 *
 * @export
 * @interface ClassAnnations
 */
export interface ClassAnnations {
    /**
     * class name
     *
     * @type {string}
     * @memberof ClassAnnations
     */
    name: string;
    /**
     * class params declaration.
     *
     * @type {ObjectMap<string[]>}
     * @memberof ClassAnnations
     */
    params: ObjectMap<string[]>;
}
/**
 * class type
 * @export
 * @interface Type
 * @extends {Function}
 * @template T
 */
export interface Type<T = any> extends Function {
    new(...args: any[]): T;
    classAnnations?: ClassAnnations;
    getClassAnnations?(): ClassAnnations;
}

/**
 * abstract type
 *
 * @export
 * @interface AbstractType
 * @extends {Function}
 * @template T
 */
export interface AbstractType<T = any> extends Function {
    new?(...args: any[]): T;
    classAnnations?: ClassAnnations;
    getClassAnnations?(): ClassAnnations;
}

/**
 * express.
 *
 * @export
 * @interface Express
 * @template T
 * @template TResult
 */
export interface Express<T, TResult> {
    (item: T): TResult
}

/**
 * express
 *
 * @export
 * @interface Express2
 * @template T1
 * @template T2
 * @template TResult
 */
export interface Express2<T1, T2, TResult> {
    (arg1: T1, arg2: T2): TResult
}

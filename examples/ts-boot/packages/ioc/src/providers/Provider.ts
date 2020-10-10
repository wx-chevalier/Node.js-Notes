import { Token, Express2, Type, ObjectMap } from '../types';
import { IIocContainer } from '../IIocContainer';
import { isFunction, isObject, isUndefined } from '../utils';
import { ProviderTypes } from './types';

/**
 * Provider interface.
 *
 * @export
 * @interface IProvider
 */
export interface IProvider {
    /**
     * this type provider to.
     *
     * @type {SymbolType}
     * @memberof Provider
     */
    provide: Token;
}


/**
 * @usageNotes
 * ```
 * @Injectable()
 * class MyService {}
 *
 * const provider: ClassProvider = {provide: 'someToken', useClass: MyService};
 * ```
 *
 * @description
 * Configures the `Injector` to return an instance of `useClass` for a token.
 *
 */
export interface ClassProvider extends IProvider {
    /**
     * use class for provide.
     *
     * @type {Type}
     * @memberof ClassProvider
     */
    useClass: Type;
    /**
     * A list of `token`s which need to be resolved by the injector. The list of values is then
     * used as arguments to the `useFactory` function.
     */
    deps?: any[];
}

/**
 * value provider.
 *
 * @usageNotes
 * ```
 * const provider: ClassProvider = {provide: 'someToken', useClass: MyService};
 * ```
 * @description
 * Configures the `Injector` to return an instance of `useValue` for a token.
 *
 * @export
 * @interface ValueProvider
 * @extends {IProvider}
 */
export interface ValueProvider extends IProvider {
    /**
     * use value for provide.
     *
     * @type {*}
     * @memberof ValueProvider
     */
    useValue: any;
}

/**
 * @usageNotes
 * ```
 * function serviceFactory() { ... }
 *
 * const provider: FactoryProvider = {provide: 'someToken', useFactory: serviceFactory, deps: []};
 * ```
 *
 * @description
 * Configures the `Injector` to return a value by invoking a `useFactory` function.
 *
 *
 */
export interface FactoryProvider extends IProvider {
    /**
    * A function to invoke to create a value for this `token`. The function is invoked with
    * resolved values of `token`s in the `deps` field.
    */
    useFactory: Function;

    /**
     * A list of `token`s which need to be resolved by the injector. The list of values is then
     * used as arguments to the `useFactory` function.
     */
    deps?: any[];
}

/**
 * existing provider.
 *
 * @usageNotes
 * ```
 * const provider: ClassProvider = {provide: 'someToken', useExisting: 'registeredToken'};
 * ```
 * @export
 * @interface ExistingProvider
 * @extends {IProvider}
 */
export interface ExistingProvider extends IProvider {
    /**
     * use existing registered token for provide.
     *
     * @type {Token}
     * @memberof ExistingProvider
     */
    useExisting: Token
}

/**
 * provider type.
 */
export type ProviderType = ObjectMapProvider | Provider |
    ValueProvider | ClassProvider | ExistingProvider | FactoryProvider;


/**
 * object map provider.
 * use to replace ObjectMap. for typed check.
 *
 * @export
 * @class ObjectMapProvider
 */
export class ObjectMapProvider {
    protected maps: ObjectMap;
    constructor() {
        this.maps = {};
    }

    get(): ObjectMap {
        return this.maps;
    }

    set(options: ObjectMap) {
        if (options) {
            this.maps = Object.assign(this.maps, options);
        }
    }
    /**
     * parse Object map to provider.
     *
     * @static
     * @param {ObjectMap} options
     * @returns
     * @memberof ObjectMapProvider
     */
    static parse(options: ObjectMap) {
        let pdr = new ObjectMapProvider();
        pdr.set(options);
        return pdr;
    }
}

/**
 *  provider, to dynamic resovle instance of params in run time.
 *
 * @export
 * @class Provider
 */
export class Provider {
    /**
     * service provider is value or value factory.
     *
     * @memberof Provider
     */
    protected value?: any
    /**
     * service is instance of type.
     *
     * @type {Token}
     * @memberof Provider
     */
    type?: Token;

    constructor(type?: Token, value?: any) {
        this.type = type;
        this.value = value;
    }

    /**
     * resolve provider value.
     *
     * @template T
     * @param {IIocContainer} container
     * @param {ProviderTypes[]} providers
     * @returns {T}
     * @memberof Provider
     */
    resolve<T>(container: IIocContainer, ...providers: ProviderTypes[]): T {
        if (isUndefined(this.value)) {
            return container.has(this.type) ? container.resolve(this.type, ...providers) : null;
        } else {
            return this.value;
        }
    }

    /**
     * create provider.
     *
     * @static
     * @param {Token} type
     * @param {(any)} value
     * @returns Provider
     * @memberof Provider
     */
    static create(type: Token, value: any): Provider {
        return new Provider(type, value);
    }

    /**
     * create extends provider.
     *
     * @static
     * @param {Token} token
     * @param {(any)} value
     * @param {Express2<any, ExtendsProvider, void>} [extendsTarget]
     * @returns {ExtendsProvider}
     * @memberof Provider
     */
    static createExtends(token: Token, value: any, extendsTarget?: Express2<any, ExtendsProvider, void>): ExtendsProvider {
        return new ExtendsProvider(token, value, extendsTarget);
    }

    /**
     * create invoked provider.
     *
     * @static
     * @param {Token} token
     * @param {string} method
     * @param {(any)} [value]
     * @returns {InvokeProvider}
     * @memberof Provider
     */
    static createInvoke(token: Token, method: string, value?: any): InvokeProvider {
        return new InvokeProvider(token, method, value);
    }

    /**
     * create param provider.
     *
     * @static
     * @param {Token} token
     * @param {(any)} value
     * @param {number} [index]
     * @param {string} [method]
     * @returns {ParamProvider}
     * @memberof Provider
     */
    static createParam(token: Token, value: any, index?: number, method?: string): ParamProvider {
        return new ParamProvider(token, value, index, method);
    }

}

/**
 * InvokeProvider
 *
 * @export
 * @class InvokeProvider
 * @extends {Provider}
 */
export class InvokeProvider extends Provider {
    /**
     * service value is the result of type instance invoke the method return value.
     *
     * @type {string}
     * @memberof Provider
     */
    protected method?: string;

    constructor(type?: Token, method?: string, value?: any) {
        super(type, value);
        this.method = method;
    }

    resolve<T>(container: IIocContainer, ...providers: ProviderTypes[]): T {
        if (this.method) {
            return container.invoke<T>(this.type, this.method, ...providers);
        }
        return super.resolve(container, ...providers);
    }
}


/**
 * param provider.
 *
 * @export
 * @interface ParamProvider
 */
export class ParamProvider extends InvokeProvider {
    /**
     * param index, param name.
     *
     * @type {number}
     * @memberof ParamProvider
     */
    index?: number;

    constructor(token?: Token, value?: any, index?: number, method?: string) {
        super(token, method, value);
        this.index = index;
    }

    /**
     * resolve param
     *
     * @template T
     * @param {IIocContainer} container
     * @param {...ProviderTypes[]} providers
     * @returns {T}
     * @memberof ParamProvider
     */
    resolve<T>(container: IIocContainer, ...providers: ProviderTypes[]): T {
        return super.resolve(container, ...providers);
    }
}

/**
 * Provider enable exntends target with provider in dynamic.
 *
 * @export
 * @class ExtendsProvider
 * @extends {Provider}
 */
export class ExtendsProvider extends Provider {


    constructor(token: Token, value?: any, private extendsTarget?: Express2<any, ExtendsProvider, void>) {
        super(token, value);
    }

    resolve<T>(container: IIocContainer, ...providers: ProviderTypes[]): T {
        return super.resolve(container, ...providers);
    }

    extends(target: any) {
        if (isObject(target) && isFunction(this.extendsTarget)) {
            this.extendsTarget(target, this);
        }
    }
}

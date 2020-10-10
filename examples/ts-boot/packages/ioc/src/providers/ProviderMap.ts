import { isToken, isFunction, isUndefined, isObject, isNumber } from '../utils';
import { Token, InstanceFactory, SymbolType, Factory, Type } from '../types';
import { IIocContainer, ContainerFactory } from '../IIocContainer';
import { IResolver, IResolverContainer } from '../IResolver';
import { ProviderTypes } from './types';
import { IocCoreService } from '../services';

// use core-js in browser.

/**
 * Provider Map.
 *
 * note: object map provider can not resolve token.
 *
 * @export
 * @class Providers
 */
export class ProviderMap extends IocCoreService implements IResolverContainer {

    get size(): number {
        return this.map.size;
    }

    private containerFac: ContainerFactory;
    getContainer(): IIocContainer {
        return this.containerFac();
    }

    map: Map<Token, InstanceFactory>;
    constructor(container: IIocContainer) {
        super()
        this.containerFac = container.getFactory();
        this.map = new Map();
    }

    keys(): (Token | number)[] {
        return Array.from(this.map.keys());
    }

    values(): InstanceFactory[] {
        return Array.from(this.map.values());
    }

    /**
     * has provide or not.
     *
     * @param {(Token | number)} provide
     * @returns {boolean}
     * @memberof ProviderMap
     */
    has(provide: Token | number): boolean {
        return this.map.has(this.getTokenKey(provide));
    }

    provides(): Token[] {
        return this.keys().filter(k => isToken(k)) as Token[];
    }

    /**
     * get token key.
     *
     * @param {(Token | number)} token
     * @returns {(SymbolType | number)}
     * @memberof ProviderMap
     */
    getTokenKey(token: Token | number): SymbolType {
        if (!isNumber(token)) {
            return this.getContainer().getTokenKey(token);
        }
        return token as any;
    }

    /**
     * get token factory.
     *
     * @template T
     * @param {(Token<T> | number)} provide
     * @returns {InstanceFactory<T>}
     * @memberof ProviderMap
     */
    get<T>(provide: Token<T> | number): InstanceFactory<T> {
        return this.map.get(this.getTokenKey(provide));
    }

    /**
     * get token provider.
     *
     * @template T
     * @param {Token<T>} token
     * @returns {Type<T>}
     * @memberof ProviderMap
     */
    getTokenProvider<T>(token: Token<T>): Type<T> {
        return this.getContainer().getTokenProvider(token);
    }

    /**
     * unregister.
     *
     * @template T
     * @param {Token<T>} token
     * @returns {this}
     * @memberof ProviderMap
     */
    unregister<T>(token: Token<T>): this {
        let key = this.getTokenKey(token);
        if (this.map.has(key)) {
            this.map.delete(key);
        }
        return this;
    }

    /**
     * add and bind token provider.
     *
     * @template T
     * @param {(Token<T> | number)} provide
     * @param {(Token<T> | Factory<T>)} provider
     * @returns {this}
     * @memberof ProviderMap
     */
    add<T>(provide: Token<T> | number, provider: Token<T> | Factory<T>): this {
        return this.register(provide, provider);
    }

    /**
     * register provider.
     *
     * @template T
     * @param {(Token<T> | number)} provide
     * @param {(Token<T> | Factory<T>)} provider
     * @returns {this}
     * @memberof ProviderMap
     */
    register<T>(provide: Token<T> | number, provider: Token<T> | Factory<T>): this {
        let key = this.getTokenKey(provide);
        if (isUndefined(key)) {
            return this;
        }
        let factory;
        if (isToken(provider) && this.getContainer().has(provider)) {
            factory = (...providers: ProviderTypes[]) => {
                return this.getContainer().resolve(provider, ...providers);
            };
        } else {
            if (isFunction(provider)) {
                factory = provider;
            } else {
                factory = () => {
                    return provider;
                };
            }
        }
        if (factory) {
            this.map.set(key, factory);
        }
        return this;
    }

    /**
     * resolve instance via provide token.
     *
     * @template T
     * @param {Token<T>} provide
     * @param {...ProviderTypes[]} providers
     * @returns {T}
     * @memberof ProviderMap
     */
    resolve<T>(provide: Token<T> | number, ...providers: ProviderTypes[]): T {
        let key = this.getTokenKey(provide);
        if (this.has(key)) {
            let provider = this.get(key);
            return isFunction(provider) ? provider(...providers) : null;
        }
        return null;
    }

    iterator(callbackfn: (fac: InstanceFactory, tk: Token, resolvor?: IResolver) => void | boolean): void | boolean {
        return !this.keys().some(tk => {
            if (isToken(tk)) {
                return callbackfn(this.get(tk), tk, this) === false;
            }
            return false;
        });
    }

    /**
     * copy provider map.
     *
     * @param {ProviderMap} map
     * @returns
     * @memberof ProviderMap
     */
    copy(map: ProviderMap): this {
        if (!map) {
            return this;
        }
        this.map.forEach((fac, key) => {
            this.map.set(key, fac);
        });
        return this;
    }
}



/**
 * object is provider map or not.
 *
 * @export
 * @param {object} target
 * @returns {target is ProviderMap}
 */
export function isProviderMap(target: object): target is ProviderMap {
    if (!isObject(target)) {
        return false;
    }
    return target instanceof ProviderMap;
}

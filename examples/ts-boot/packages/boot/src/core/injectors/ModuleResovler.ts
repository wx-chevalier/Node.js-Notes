import {
    Token, Type, ParamProviders, isToken,
    IResolver, IResolverContainer, InstanceFactory, SymbolType, ContainerFactory
} from '@tsdi/ioc';
import { IModuleMetadata, IModuleResolver } from '../modules';
import { IContainer, isContainer } from '@tsdi/core';
import { DIModuleExports } from './DIModuleExports';


/**
 * injected module.
 *
 * @export
 * @class InjectedModule
 * @template T
 */
export class ModuleResovler<T> implements IModuleResolver {

    constructor(
        public token: Token<T>,
        public config: IModuleMetadata<T>,
        container: IContainer,
        public type?: Type,
        providers?: IResolverContainer
    ) {
        if (isContainer(container)) {
            this.containerFac = container.getFactory();
        }
        if (providers) {
            this.providersGetter = () => providers;
        }
    }
    private containerFac: ContainerFactory;

    getContainer(): IContainer {
        return this.containerFac() as IContainer;
    }

    private providersGetter: () => IResolverContainer;
    getProviders(): IResolverContainer {
        if (this.providersGetter) {
            return this.providersGetter();
        }
        return this.containerFac();
    }

    get size(): number {
        return this.getProviders().size;
    }

    getTokenKey<T>(token: Token<T>, alias?: string): SymbolType<T> {
        return this.getContainer().getTokenKey(token, alias);
    }

    resolve<T>(token: Token<T>, ...providers: ParamProviders[]): T {
        let pdr = this.getProviders();
        if (pdr && pdr.has(token)) {
            return pdr.resolve(token, ...providers);
        } else {
            return this.getContainer().get(DIModuleExports).resolve(token, ...providers);
        }
    }

    has<T>(token: Token<T>, alias?: string): boolean {
        let key = this.getContainer().getTokenKey(token, alias);
        let pdr = this.getProviders();
        if (pdr && pdr.has(key)) {
            return true
        }
        return false;
    }

    getTokenProvider<T>(token: Token<T>): Type<T> {
        return this.getContainer().getTokenProvider(token);
    }

    iterator(callbackfn: (fac: InstanceFactory, tk: Token, resolvor?: IResolver) => boolean | void): boolean | void {
        let pdr = this.getProviders();

        if (pdr.iterator((fac, tk) => {
            if (isToken(tk)) {
                return callbackfn(fac, fac, pdr);
            }
        }) === false) {
            return false;
        }
    }

    unregister<T>(token: Token<T>): this {
        this.getProviders().unregister(token);
        this.getContainer().unregister(token);
        return this;
    }
}

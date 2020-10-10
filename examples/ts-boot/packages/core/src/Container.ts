import 'reflect-metadata';
import { IContainer } from './IContainer';
import { IContainerBuilder, ContainerBuilderToken } from './IContainerBuilder';
import { ProviderTypes, IocContainer, Type, Token, Modules, LoadType, ProviderMap, isToken, isArray, ContainerFactory, ContainerFactoryToken } from '@tsdi/ioc';
import { ModuleLoader, IModuleLoader } from './services';
import { registerCores } from './registerCores';
import {
    ResolveServiceContext, ResolveServicesContext, ServiceOption,
    ServicesOption, ServiceResolveLifeScope, ServicesResolveLifeScope
} from './resolves';
import { InjectorLifeScope } from './injectors';


/**
 * Container
 *
 * @export
 * @class Container
 * @implements {IContainer}
 */
export class Container extends IocContainer implements IContainer {

    constructor() {
        super();
    }

    protected init() {
        super.init();
        registerCores(this);
    }

    /**
     * current container has register.
     *
     * @template T
     * @param {Token<T>} key
     * @returns {boolean}
     * @memberof IContainer
     */
    hasRegister<T>(key: Token<T>): boolean {
        return this.has(key);
    }

    /**
     * get container builder.
     *
     * @returns {IContainerBuilder}
     * @memberof Container
     */
    getBuilder(): IContainerBuilder {
        return this.get(ContainerBuilderToken);
    }

    /**
     * get module loader.
     *
     * @returns {IModuleLoader}
     * @memberof IContainer
     */
    getLoader(): IModuleLoader {
        return this.get(ModuleLoader);
    }

    /**
     * get token implements class type.
     *
     * @template T
     * @param {Token<T>} token
     * @param {boolean} [inchain]
     * @returns {Type<T>}
     * @memberof Container
     */
    getTokenImpl<T>(token: Token<T>): Type<T> {
        return this.getTokenProvider(token);
    }

    /**
     * use modules.
     *
     * @param {...Modules[]} modules
     * @returns {this}
     * @memberof Container
     */
    use(...modules: Modules[]): this {
        (async () => {
            this.getActionRegisterer().get(InjectorLifeScope).register(...modules);
        })();
        return this;
    }

    /**
     * async use modules.
     *
     * @param {...LoadType[]} modules load modules.
     * @returns {Promise<Type[]>}  types loaded.
     * @memberof IContainer
     */
    async load(...modules: LoadType[]): Promise<Type[]> {
        let mdls = await this.getLoader().load(...modules);
        return this.getActionRegisterer().get(InjectorLifeScope).register(...mdls);
    }

    /**
     *  get service or target reference service.
     *
     * @template T
     * @param {(Token<T> | ServiceOption<T> | ResolveServiceContext<T>)} target
     * @param {...ProviderTypes[]} providers
     * @returns {T}
     * @memberof Container
     */
    getService<T>(target: Token<T> | ServiceOption<T> | ResolveServiceContext<T>, ...providers: ProviderTypes[]): T {
        let context: ResolveServiceContext<T>;
        if (isToken(target)) {
            context = ResolveServiceContext.parse(target);
        } else if (target instanceof ResolveServiceContext) {
            context = target;
        } else {
            context = ResolveServiceContext.parse(target);
        }

        if (isArray(context.providers)) {
            context.providers.push(...providers);
        } else {
            context.providers = providers;
        }

        this.getActionRegisterer().get(ServiceResolveLifeScope).execute(context);
        return context.instance || null;
    }

    /**
     * get all service extends type and reference target.
     *
     * @template T
     * @param {(Token<T> | ServicesOption<T> | ResolveServicesContext<T>)} target
     * @param {...ProviderTypes[]} providers
     * @returns {T[]}
     * @memberof Container
     */
    getServices<T>(target: Token<T> | ServicesOption<T> | ResolveServicesContext<T>, ...providers: ProviderTypes[]): T[] {
        let maps = this.getServiceProviders(target);
        let services = [];
        maps.iterator((fac) => {
            services.push(fac(...providers));
        });
        return services;
    }

    /**
     * get service providers.
     *
     * @template T
     * @param {Token<T>} target
     * @param {ResolveServicesContext} [ctx]
     * @returns {ProviderMap}
     * @memberof Container
     */
    getServiceProviders<T>(target: Token<T> | ServicesOption<T> | ResolveServicesContext<T>, ctx?: ResolveServicesContext<T>): ProviderMap {
        let context: ResolveServicesContext<T>;
        if (isToken(target)) {
            context = ResolveServicesContext.parse(target);
        } else if (target instanceof ResolveServicesContext) {
            context = target;
        } else {
            context = ResolveServicesContext.parse(target);
        }
        this.getActionRegisterer().get(ServicesResolveLifeScope).execute(context);
        return context.services;
    }
}

/**
 * is container or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Container}
 */
export function isContainer(target: any): target is Container {
    return target && target instanceof Container;
}

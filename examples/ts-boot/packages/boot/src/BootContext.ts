import { AnnoationContext, AnnoationOption, createAnnoationContext } from './core';
import { RunnableConfigure, ConfigureManager } from './annotations';
import { IModuleLoader, IContainer } from '@tsdi/core';
import { ProviderTypes, LoadType, InjectToken, Type, Injectable, Inject, ContainerFactory } from '@tsdi/ioc';
import { Startup } from './runnable';
import { IComponentContext } from './builder';
import { ILoggerManager, ConfigureLoggerManger } from '@tsdi/logs';
import { StartupServices } from './services';



/**
 *  current application boot context token.
 */
export const ApplicationContextToken = new InjectToken<BootContext>('app__context');
export const ApplicationBootContextToken = ApplicationContextToken;

/**
 * boot options
 *
 * @export
 * @interface BootOptions
 */
export interface BootOption extends AnnoationOption {
    /**
     * boot base url.
     *
     * @type {string}
     * @memberof BootOptions
     */
    baseURL?: string;

    /**
     * module loader
     *
     * @type {IModuleLoader}
     * @memberof BootOptions
     */
    loader?: IModuleLoader;

    /**
     * annoation metadata config.
     *
     * @type {RunnableConfigure}
     * @memberof AnnoationContext
     */
    annoation?: RunnableConfigure;

    /**
     * custom configures
     *
     * @type {((string | RunnableConfigure)[])}
     * @memberof BootOptions
     */
    configures?: (string | RunnableConfigure)[];

    /**
     * target module instace.
     *
     * @type {*}
     * @memberof BootOptions
     */
    target?: any;

    /**
     * bootstrap instance.
     *
     * @type {T}
     * @memberof BootOptions
     */
    bootstrap?: any;

    /**
     * component scope.
     *
     * @type {*}
     * @memberof BootOption
     */
    scope?: any;
    /**
     * bind template
     *
     * @type {*}
     * @memberof BootOption
     */
    template?: any;

    /**
     * boot run args.
     *
     * @type {string[]}
     * @memberof BootOptions
     */
    args?: string[];

    /**
     *  custom boot data of `BuildOptions`
     *
     * @type {*}
     * @memberof BootOptions
     */
    data?: any;

    /**
     * bootstrap reference runable service.
     *
     * @type {Startup}
     * @memberof BootOptions
     */
    runnable?: Startup;

    /**
     * auto run runnable or not.
     *
     * @type {boolean}
     * @memberof BootOptions
     */
    autorun?: boolean;

    /**
     * boot dependencies.
     *
     * @type {LoadType[]}
     * @memberof BootOptions
     */
    deps?: LoadType[];

    /**
    * providers.
    *
    * @type {ProviderTypes[]}
    * @memberof BootOptions
    */
    providers?: ProviderTypes[];

    /**
     * container getter.
     *
     * @type {ContainerFactory}
     * @memberof BootOption
     */
    raiseContainer?: ContainerFactory<IContainer>;
}

export const BootTargetToken = new InjectToken('module_type');
/**
 * application boot context.
 *
 * @export
 * @class BootContext
 * @extends {HandleContext}
 */
@Injectable
export class BootContext extends AnnoationContext implements IComponentContext {

    constructor(@Inject(BootTargetToken) type: Type) {
        super(type);
    }

    getLogManager(): ILoggerManager {
        return this.raiseContainer().resolve(ConfigureLoggerManger);
    }

    /**
     * boot base url.
     *
     * @type {string}
     * @memberof BootContext
     */
    baseURL: string;
    /**
     * module loader
     *
     * @type {IModuleLoader}
     * @memberof BootContext
     */
    loader?: IModuleLoader;
    /**
     * configuration merge metadata config and all application config.
     *
     * @type {RunnableConfigure}
     * @memberof BootContext
     */
    configuration: RunnableConfigure;
    /**
     * annoation metadata config.
     *
     * @type {RunnableConfigure}
     * @memberof AnnoationContext
     */
    annoation: RunnableConfigure;
    /**
     * component scope.
     *
     * @type {*}
     * @memberof BootOption
     */
    scope?: any;

    /**
     * the template data to binding property.
     *
     * @type {*}
     * @memberof BootOption
     */
    template?: any;

    /**
     * custom configures
     *
     * @type {((string | RunnableConfigure)[])}
     * @memberof BootContext
     */
    configures?: (string | RunnableConfigure)[] = [];

    /**
     * target module instace.
     *
     * @type {*}
     * @memberof BootContext
     */
    target?: any;

    /**
     * boot run args.
     *
     * @type {string[]}
     * @memberof BootContext
     */
    args?: string[];

    /**
     * configure bootstrap instance.
     *
     * @type {T}
     * @memberof RunnableOptions
     */
    bootstrap?: any;

    /**
     *  custom boot input data
     *
     * @type {*}
     * @memberof RunnableOptions
     */
    data?: any;

    /**
     * auto run runnable or not.
     *
     * @type {boolean}
     * @memberof BootContext
     */
    autorun?: boolean;

    /**
     * bootstrap runnable service.
     *
     * @type {IStartup}
     * @memberof BootContext
     */
    runnable?: Startup;

    /**
     * startup services
     *
     * @type {Token[]}
     * @memberof BootContext
     */
    get starupServices(): StartupServices {
        return this.getRaiseContainer().resolve(StartupServices);
    }

    /**
     * boot dependencies.
     *
     * @type {LoadType[]}
     * @memberof BootContext
     */
    deps?: LoadType[];

    /**
    * providers.
    *
    * @type {ProviderTypes[]}
    * @memberof BootOptions
    */
    providers?: ProviderTypes[];

    /**
     * get boot target.
     *
     * @returns {*}
     * @memberof BootContext
     */
    getBootTarget(): any {
        return this.bootstrap || this.target;
    }

    /**
     * get configure manager.
     *
     * @template T
     * @returns {ConfigureManager<T>}
     * @memberof BootContext
     */
    getConfigureManager<T>(): ConfigureManager<T> {
        return this.getRaiseContainer().resolve(ConfigureManager) as ConfigureManager<T>;
    }

    static parse(target: Type | BootOption, raiseContainer?: ContainerFactory<IContainer>): BootContext {
        return createAnnoationContext(BootContext, target, raiseContainer);
    }
}

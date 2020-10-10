import { IocCoreService, Type, ProviderTypes, InjectToken } from '@tsdi/ioc';
import { BootContext, BootOption } from '../BootContext';
import { IContainer } from '@tsdi/core';
import { IBootApplication } from '../IBootApplication';
import { IModuleResolveOption } from './resovers';
import { IStartup } from '../runnable';

export interface BootSubAppOption<T extends BootContext> {
    /**
     * sub context init.
     *
     * @memberof SubAppBootOption
     */
    contextInit?: (ctx: T) => void;

    /**
     * custom reg current app exports to parent.
     *
     * @memberof SubAppBootOption
     */
    regExports?: (ctx: T, parent: IContainer) => void;
}

/**
 * service run runnable module.
 *
 * @export
 * @class BuilderService
 * @extends {IocCoreService}
 */
export interface IBuilderService extends IocCoreService {
    /**
     * resolve binding module.
     *
     * @template T
     * @param {Type} target
     * @param {IModuleResolveOption} options
     * @param {...ProviderTypes[]} providers
     * @returns {Promise<T>}
     * @memberof BuilderService
     */
    resolve<T>(target: Type<T>, options: IModuleResolveOption, ...providers: ProviderTypes[]): Promise<T>;
    /**
     * build target instance.
     *
     * @template T
     * @template Topt
     * @param {(Type<T> | Topt | BootContext)} target
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof IBuilderService
     */
    buildTarget<T, Topt extends BootOption = BootOption>(target: Type<T> | Topt | BootContext, ...args: string[]): Promise<T>;
    /**
     * build bootstrap target instance.
     *
     * @param {(Type | BootOption | BootContext)} target
     * @param {...string[]} args
     * @returns {Promise<any>}
     * @memberof IBuilderService
     */
    buildBootTarget(target: Type | BootOption | BootContext, ...args: string[]): Promise<any>;

    build(target: Type | BootOption | BootContext, ...args: string[]): Promise<BootContext>
    build<Topt extends BootOption>(target: Type | Topt | BootContext, ...args: string[]): Promise<BootContext>;
    build<T extends BootContext>(target: Type | BootOption | T, ...args: string[]): Promise<T>;
    /**
     * build module.
     *
     * @template T
     * @template Topt
     * @param {(Type | Topt | T)} target
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof IBuilderService
     */
    build<T extends BootContext, Topt extends BootOption>(target: Type | Topt | T, ...args: string[]): Promise<T>;

    /**
     * build startup instance.
     *
     * @template T
     * @template Topt
     * @param {(Type | Topt | BootContext)} target
     * @param {...string[]} args
     * @returns {Promise<IStartup<T>>}
     * @memberof IBuilderService
     */
    buildStartup<T, Topt extends BootOption = BootOption>(target: Type | Topt | BootContext, ...args: string[]): Promise<IStartup<T>>;

    /**
     * create runnable.
     *
     * @template T
     * @template Topt
     * @param {(Type | Topt | BootContext)} target
     * @param {...string[]} args
     * @returns {Promise<IStartup<T>>}
     * @memberof IBuilderService
     */
    buildRunnable<T, Topt extends BootOption = BootOption>(target: Type | Topt | BootContext, ...args: string[]): Promise<IStartup<T>>;

    run(target: Type | BootOption | BootContext, ...args: string[]): Promise<BootContext>
    run<Topt extends BootOption>(target: Type | Topt | BootContext, ...args: string[]): Promise<BootContext>;
    run<T extends BootContext>(target: Type | BootOption | T, ...args: string[]): Promise<T>;
    /**
     * run module.
     *
     * @template T
     * @template Topt
     * @param {(Type | Topt | T)} target
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof IBuilderService
     */
    run<T extends BootContext, Topt extends BootOption>(target: Type | Topt | T, ...args: string[]): Promise<T>;
    /**
     * boot application.
     *
     * @template T
     * @template Topt
     * @param {(Type | Topt | T)} target
     * @param {((ctx: T) => void | BootSubAppOption<T> | string)} [options]
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof IBuilderService
     */
    boot<T extends BootContext, Topt extends BootOption = BootOption>(target: Type | Topt | T, options?: (ctx: T) => void | BootSubAppOption<T> | string, ...args: string[]): Promise<T>;
    /**
     * boot application.
     *
     * @param {IBootApplication} application
     * @param {...string[]} args
     * @returns {Promise<BootContext>}
     * @memberof IBuilderService
     */
    bootApp(application: IBootApplication, ...args: string[]): Promise<BootContext>;
}


export const BuilderServiceToken = new InjectToken<IBuilderService>('BOOT_BuilderService');

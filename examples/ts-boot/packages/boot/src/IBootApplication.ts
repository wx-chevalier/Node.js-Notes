import { BootContext, BootOption } from './BootContext';
import { ContextInit } from './BootApplication';
import { LoadType, Type } from '@tsdi/ioc';
import { IContainerPool } from './core';

/**
 * boot application interface.
 *
 * @export
 * @interface IBootApplication
 * @extends {ContextInit<T>}
 * @template T
 */
export interface IBootApplication<T extends BootContext = BootContext> extends ContextInit<T> {

    /**
     * boot target.
     *
     * @type {(Type | BootOption | T)}
     * @memberof IBootApplication
     */
    target?: Type | BootOption | T;

    /**
     * get boot application context.
     *
     * @returns {T}
     * @memberof IBootApplication
     */
    getContext(): T;

    /**
     * run application
     *
     * @param {(LoadType[] | LoadType | string)} [deps]
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof IBootApplication
     */
    run(deps?: LoadType[] | LoadType | string, ...args: string[]): Promise<T>;

    /**
     * get container pools of application.
     *
     * @returns {IContainerPool}
     * @memberof IBootApplication
     */
    getPools(): IContainerPool;

    /**
     * boot applicaton extends.
     *
     * @returns {LoadType[]}
     * @memberof IBootApplication
     */
    getBootDeps(): LoadType[];
}

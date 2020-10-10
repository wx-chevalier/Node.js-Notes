import { ObjectMap, LoadType, InjectToken } from '@tsdi/ioc';
import { ModuleConfigure } from '../core';

/**
 *  process run root.
 */
export const ProcessRunRootToken = new InjectToken<string>('__boot_process_root');

/**
 * runnable configure.
 *
 * @export
 * @interface RunnableConfigure
 * @extends {ModuleConfigure}
 */
export interface RunnableConfigure extends ModuleConfigure {
    /**
     * deps.
     *
     * @type {LoadType[]}
     * @memberof RunnableConfigure
     */
    deps?: LoadType[];
    /**
     * application name.
     *
     * @type {string}
     * @memberof AppConfigure
     */
    name?: string;
    /**
     * set enable debug log or not.
     *
     * @type {boolean}
     * @memberof AppConfigure
     */
    debug?: boolean;

    /**
     * log config.
     *
     * @type {*}
     * @memberof AppConfigure
     */
    logConfig?: any;

    /**
     * custom config key value setting.
     *
     * @type {ObjectMap}
     * @memberOf AppConfigure
     */
    setting?: ObjectMap;

    /**
     * custom config connections.
     *
     * @type {any}
     * @memberof AppConfigure
     */
    connections?: any;

}

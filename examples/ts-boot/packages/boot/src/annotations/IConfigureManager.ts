import { InjectToken } from '@tsdi/ioc';
import { RunnableConfigure } from './RunnableConfigure';

/**
 * configure manager token.
 */
export const ConfigureMgrToken = new InjectToken<IConfigureManager>('config-mgr');

/**
 * default configuration token.
 */
export const DefaultConfigureToken = new InjectToken<RunnableConfigure>('DI_Default_Configuration');


/**
 * configure loader.
 *
 * @export
 * @interface IConfigureLoader
 */
export interface IConfigureLoader<T extends RunnableConfigure = RunnableConfigure> {
    /**
     * load config.
     *
     * @param {string} [uri]
     * @returns {Promise<T>}
     * @memberof AppConfigureLoader
     */
    load(uri?: string): Promise<T>;
}

/**
 * configure loader token.
 */
export const ConfigureLoaderToken = new InjectToken<IConfigureLoader>('DI_Configure_Loader');

/**
 * configure manager.
 *
 * @export
 * @interface IConfigureManager
 * @template T
 */
export interface IConfigureManager<T extends RunnableConfigure = RunnableConfigure> {
    /**
     * use configuration.
     *
     * @param {(string | AppConfigure)} [config]
     * @returns {this} this configure manager.
     * @memberof IConfigureManager
     */
    useConfiguration(config?: string | T): this;

    /**
     * get config.
     *
     * @returns {Promise<T>}
     * @memberof IConfigureManager
     */
    getConfig(): Promise<T>;
}

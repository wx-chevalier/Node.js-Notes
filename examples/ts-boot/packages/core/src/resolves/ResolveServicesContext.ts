import { ClassType, ProviderMap, Token, createResolveContext } from '@tsdi/ioc';
import { ServiceOption, ResolveServiceContext } from './ResolveServiceContext';

/**
 * services context options
 *
 * @export
 * @interface ServicesOption
 * @extends {ServiceOption}
 */
export interface ServicesOption<T> extends ServiceOption<T> {
    /**
     * get services both in container and target private refrence service.
     *
     * @type {boolean}
     * @memberof ServicesActionOption
     */
    both?: boolean;
    /**
     * class type.
     *
     * @type {ClassType[]}
     * @memberof ServicesActionOption
     */
    types?: ClassType[];
}

/**
 * resolve services context.
 *
 * @export
 * @class ResolveServicesContext
 * @extends {ResolveServiceContext}
 */
export class ResolveServicesContext<T = any> extends ResolveServiceContext<T> {
    constructor(token?: Token<T>) {
        super(token)
    }
    /**
     * parse service resolve context.
     *
     * @static
     * @param {ServicesOption} [options]
     * @returns {ResolveServicesContext}
     * @memberof ResolveServicesContext
     */
    static parse<T>(target?: Token<T> | ServicesOption<T>): ResolveServicesContext<T> {
        return createResolveContext<T, ResolveServicesContext<T>>(ResolveServicesContext, target);
    }

    /**
     * get services both in container and target private refrence service.
     *
     * @type {boolean}
     * @memberof ResolveServicesContext
     */
    both?: boolean;

    types?: ClassType[];

    /**
     * all matched services map.
     *
     * @type {ProviderMap}
     * @memberof ResolveServicesContext
     */
    services?: ProviderMap;

}

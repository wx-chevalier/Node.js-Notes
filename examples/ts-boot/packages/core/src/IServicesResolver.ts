import { Token, ProviderTypes, ProviderMap } from '@tsdi/ioc';
import { ResolveServicesContext, ServicesOption } from './resolves';

/**
 * services resolver.
 *
 * @export
 * @interface IServicesResolver
 */
export interface IServicesResolver {

    /**
     * get all service extends type.
     *
     * @template T
     * @param {(Token<T> | ServicesOption<T> | ResolveServicesContext<T>)} target servive token or express match token.
     * @param {...ProviderTypes[]} providers
     * @returns {T[]} all service instance type of token type.
     * @memberof IContainer
     */
    getServices<T>(target: Token<T> | ServicesOption<T> | ResolveServicesContext<T>, ...providers: ProviderTypes[]): T[];

    /**
     * get all provider service.
     *
     * @template T
     * @param {(Token<T> | ServicesOption<T> | ResolveServicesContext<T>)} target
     * @param {ResolveServicesContext<T>} [ctx]
     * @returns {ProviderMap}
     * @memberof IServicesResolver
     */
    getServiceProviders<T>(target: Token<T> | ServicesOption<T> | ResolveServicesContext<T>, ctx?: ResolveServicesContext<T>): ProviderMap;
}

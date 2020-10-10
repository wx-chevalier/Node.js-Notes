import { Token, ProviderTypes } from '@tsdi/ioc';
import { ResolveServiceContext, ServiceOption } from './resolves';

/**
 * service resolver.
 *
 * @export
 * @interface IServiceResolver
 */
export interface IServiceResolver {

    /**
     * get service or target reference service.
     *
     * @template T
     * @param {(Token<T> | ServiceOption<T> | ResolveServiceContext<T>)} target servive token.
     * @param {...ProviderTypes[]} providers
     * @returns {T}
     * @memberof IContainer
     */
    getService<T>(target: Token<T> | ServiceOption<T> | ResolveServiceContext<T>, ...providers: ProviderTypes[]): T;

}

import { ParamProviders } from './types';
import { ProviderMap } from '../providers';

/**
 * Providers Parser interface.
 *
 * @export
 * @interface IProviderParser
 */
export interface IProviderParser {
    /**
     * convert to provider map.
     *
     * @param {...ParamProviders[]} providers
     * @returns {ProviderMap}
     * @memberof IProviderParser
     */
    parse(...providers: ParamProviders[]): ProviderMap;
}

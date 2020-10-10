import { Token } from '../types';
import { TypeMetadata } from './TypeMetadata';
import { RefMetadata } from './RefMetadata';

/**
 * provider type to.
 *
 * @export
 * @interface Provider
 * @extends {MetaType}
 */
export interface ProviderMetadata extends TypeMetadata, RefMetadata  {
    /**
     * this type provider to.
     *
     * @type {SymbolType}
     * @memberof Provider
     */
    provide?:  Token;
    /**
     * provide alias.
     *
     * @type {string}
     * @memberof ProviderMetadata
     */
    alias?: string;
}

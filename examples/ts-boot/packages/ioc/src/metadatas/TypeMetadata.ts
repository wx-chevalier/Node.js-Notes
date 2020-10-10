import { Metadate } from './Metadate';
import { SymbolType } from '../types';

/**
 * type metadata
 *
 * @export
 * @interface TypeMetadata
 */
export interface TypeMetadata extends Metadate {
    /**
     * property type
     *
     * @type {SymbolType}
     * @memberof TypeMetadata
     */
    type?: SymbolType;
}

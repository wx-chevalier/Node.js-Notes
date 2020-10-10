import { Token } from '../types';
import { TypeMetadata } from './TypeMetadata';

/**
 * provide type from.
 *
 * @export
 * @interface Provide
 * @extends {MetaType}
 */
export interface ProvideMetadata extends TypeMetadata {
    /**
     * this type provide from.
     *
     * @type {Token}
     * @memberof Provide
     */
    provider?:  Token;

    /**
     * alias name. use to create Registration with provider.
     *
     * @type {string}
     * @memberof ProvideMetadata
     */
    alias?: string;
}

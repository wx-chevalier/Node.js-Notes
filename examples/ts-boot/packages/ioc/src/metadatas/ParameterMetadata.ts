import { PropertyMetadata } from './PropertyMetadata';

/**
 * parameter metadata.
 *
 * @export
 * @interface ParameterMetadata
 * @extends {PropertyMetadata}
 */
export interface ParameterMetadata extends PropertyMetadata {
    /**
     * parameter index.
     *
     * @type {number}
     * @memberof ParameterMetadata
     */
    index?: number;

    /**
     * default value
     *
     * @type {object}
     * @memberof ParameterMetadata
     */
    defaultValue?: object
}

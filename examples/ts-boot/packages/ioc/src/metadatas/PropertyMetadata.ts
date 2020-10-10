import { ProvideMetadata } from './ProvideMetadata';


/**
 * property metadata
 *
 * @export
 * @interface PropMetadata
 */
export interface PropertyMetadata extends ProvideMetadata {
    /**
     * property name
     *
     * @type {string}
     * @memberof PropertyMetadata
     */
    propertyKey?: string;
}

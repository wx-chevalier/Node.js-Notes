import { PropertyMetadata } from './PropertyMetadata';
import { MethodMetadata } from './MethodMetadata';

/**
 * method prorerty metadata.
 *
 * @export
 * @interface MethodPropMetadata
 * @extends {PropertyMetadata}
 * @extends {MethodMetadata}
 */
export interface MethodPropMetadata extends PropertyMetadata, MethodMetadata {

}

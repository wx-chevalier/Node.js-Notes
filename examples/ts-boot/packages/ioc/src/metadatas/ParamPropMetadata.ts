import { PropertyMetadata } from './PropertyMetadata';
import { ParameterMetadata } from './ParameterMetadata';

/**
 * parameter property metadata.
 *
 * @export
 * @interface ParamPropMetadata
 * @extends {PropertyMetadata}
 * @extends {ParameterMetadata}
 */
export interface ParamPropMetadata extends PropertyMetadata, ParameterMetadata {

}

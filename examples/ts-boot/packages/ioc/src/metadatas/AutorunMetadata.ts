import { TypeMetadata } from './TypeMetadata';

/**
 * AutoWired metadata.
 *
 * @export
 * @interface AutorunMetadata
 * @extends {TypeMetadata}
 */
export interface AutorunMetadata extends TypeMetadata {
    autorun?: string;
    singleton?: boolean;
    order?: number;
}

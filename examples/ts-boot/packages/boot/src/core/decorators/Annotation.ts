import { ITypeDecorator, MetadataAdapter, MetadataExtends, createClassDecorator } from '@tsdi/ioc';
import { IAnnotationMetadata } from '../modules';


/**
 * annotation metadata.
 *
 * @export
 * @interface AnnotationMetadata
 * @extends {AnnotationConfigure}
 */
export interface AnnotationMetadata extends IAnnotationMetadata {

}

/**
 * Annotation decorator, use to define class build way via config.
 *
 * @export
 * @interface IAnnotationDecorator
 * @extends {ITypeDecorator<T>}
 * @template T
 */
export interface IAnnotationDecorator<T extends AnnotationMetadata> extends ITypeDecorator<T> {
    /**
     * Annotation decorator, use to define class as DI Module.
     *
     * @Build
     *
     * @param {T} [metadata] bootstrap metadate config.
     */
    (metadata: T): ClassDecorator;
}

/**
 * create type builder decorator
 *
 * @export
 * @template T
 * @param {string} name
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metadataExtends]
 * @returns {IAnnotationDecorator<T>}
 */
export function createAnnotationDecorator<T extends AnnotationMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IAnnotationDecorator<T> {

    return createClassDecorator<AnnotationMetadata>(name,
        args => {
            if (adapter) {
                adapter(args);
            }
        },
        metadata => {
            if (metadataExtends) {
                metadataExtends(metadata as T);
            }
            return metadata;
        }) as IAnnotationDecorator<T>;
}


/**
 * Annotation decorator, use to define class build way via config.
 *
 * @Annotation
 */
export const Annotation: IAnnotationDecorator<AnnotationMetadata> = createAnnotationDecorator<AnnotationMetadata>('Annotation');

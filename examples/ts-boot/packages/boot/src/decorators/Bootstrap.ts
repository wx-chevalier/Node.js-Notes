import {
    Token, MetadataAdapter, MetadataExtends, ITypeDecorator,
    isFunction, isClass, createClassDecorator
} from '@tsdi/ioc';
import { RunnableConfigure } from '../annotations';

/**
 * bootstrap metadata.
 *
 * @export
 * @interface BootstrapMetadata
 * @extends {AppConfigure}
 */
export interface BootstrapMetadata extends RunnableConfigure {
    /**
     * module bootstrap token.
     *
     * @type {Token<T>}
     * @memberof AnnotationConfigure
     */
    bootstrap?: Token;

    /**
     * configuration.
     *
     * @type {RunnableConfigure}
     * @memberof BootstrapMetadata
     */
    bootConfiguration?: RunnableConfigure
}


/**
 * Bootstrap decorator, use to define class is a task element.
 *
 * @export
 * @interface IBootstrapDecorator
 * @extends {ITypeDecorator<T>}
 * @template T
 */
export interface IBootstrapDecorator<T extends BootstrapMetadata> extends ITypeDecorator<T> {
    /**
     * Bootstrap decorator, use to define class as Application Bootstrap element.
     *
     * @Bootstrap
     *
     * @param {T} metadata bootstrap metadate config.
     */
    (metadata: T): ClassDecorator;
}


/**
 * create bootstrap decorator.
 *
 * @export
 * @template T
 * @param {string} name
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metadataExtends]
 * @returns {IBootstrapDecorator<T>}
 */
export function createBootstrapDecorator<T extends BootstrapMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IBootstrapDecorator<T> {

    return createClassDecorator<BootstrapMetadata>(name, adapter, (metadata: T) => {
        if (metadataExtends) {
            metadataExtends(metadata);
        }

        // static main.
        if (isClass(metadata.type) && isFunction(metadata.type['main'])) {
            setTimeout(() => {
                metadata.type['main'](metadata);
            }, 100);
        }
        return metadata;
    }) as IBootstrapDecorator<T>;
}

/**
 * Bootstrap Decorator, definde class as mvc bootstrap module.
 *
 * @Bootstrap
 */
export const Bootstrap: IBootstrapDecorator<BootstrapMetadata> = createBootstrapDecorator<BootstrapMetadata>('Bootstrap');

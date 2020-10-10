import { MethodPropMetadata } from '../metadatas';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';



export type MethodPropDecorator = (target: Object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => void;
/**
 * method and Property decorator.
 *
 * @export
 * @interface IMethodPropDecorator
 */
export interface IMethodPropDecorator<T extends MethodPropMetadata> {
    /**
     * create method decorator with metadata map.
     * @param {T} [metadata]
     */
    (metadata?: T): MethodPropDecorator;
    (target: object, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<any>): void;
}

/**
 * create method or property decorator
 *
 * @export
 * @template T
 * @param {string} name
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns {IMethodPropDecorator<T>}
 */
export function createMethodPropDecorator<T extends MethodPropMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IMethodPropDecorator<T> {
    let decorator = createDecorator<T>(name, adapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Method | DecoratorType.Property;
    return decorator;
}


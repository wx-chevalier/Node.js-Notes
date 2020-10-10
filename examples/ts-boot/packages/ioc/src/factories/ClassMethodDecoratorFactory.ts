import { Type } from '../types';
import { TypeMetadata } from '../metadatas';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory'
import { DecoratorType } from './DecoratorType';


export type ClassMethodDecorator = (target: Object | Type, propertyKey?: string | symbol, descriptor?: TypedPropertyDescriptor<any>) => void;

/**
 * class method decorator
 *
 * @export
 * @interface IClassMethodDecorator
 * @template T
 */
export interface IClassMethodDecorator<T extends TypeMetadata> {
    /**
     * create decorator with metadata map. for class or method decorator.
     *
     * @param {T} [metadata] metadata map.
     */
    (metadata?: T): ClassMethodDecorator;

    (target: Type): void;
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
}

/**
 * create decorator for class and method.
 *
 * @export
 * @template T
 * @param {string} name
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns {IClassMethodDecorator<T>}
 */
export function createClassMethodDecorator<T extends TypeMetadata>(name: string, adapter?: MetadataAdapter, metadataExtends?: MetadataExtends<T>): IClassMethodDecorator<T> {
    let decorator = createDecorator<T>(name, adapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Class | DecoratorType.Method;
    return decorator;
}


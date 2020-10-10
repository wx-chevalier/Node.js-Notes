import 'reflect-metadata';
import { MethodMetadata } from '../metadatas';
import { ParamProviders } from '../providers';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { ArgsIterator } from './ArgsIterator';


/**
 * Method decorator.
 *
 * @export
 * @interface IMethodDecorator
 */
export interface IMethodDecorator<T extends MethodMetadata> {
    /**
     * create method decorator with providers.
     *
     * @param  {ParamProviders[]} [providers]
     */
    (providers?: ParamProviders[]): MethodDecorator;
    /**
     * create method decorator with metadata map.
     * @param {T} [metadata]
     */
    (metadata?: T): MethodDecorator;
    /**
     * create method decorator.
     * @param {Object} target
     * @param {(string | symbol)} propertyKey
     * @param {TypedPropertyDescriptor<any>} descriptor
     */
    (target: Object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>): void;
}


/**
 * create method decorator.
 *
 * @export
 * @template T metadata type.
 * @param {string} name decorator name.
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns
 */
export function createMethodDecorator<T extends MethodMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IMethodDecorator<T> {

    let methodAdapter = (args: ArgsIterator) => {
        if (adapter) {
            adapter(args);
        }
    }

    let decorator = createDecorator<T>(name, methodAdapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Method;
    return decorator;
}

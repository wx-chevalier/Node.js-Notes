import { PropertyMetadata } from '../metadatas';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { isToken, isProvideMetadata } from '../utils';
import { ArgsIterator } from './ArgsIterator';
import { Token } from '../types';

/**
 * property decorator.
 *
 * @export
 * @interface IPropertyDecorator
 */
export interface IPropertyDecorator<T extends PropertyMetadata> {
    /**
     * define property decorator with param.
     *
     * @param {Token<T>} provider define provider to resolve value to the property.
     */
    (provider: Token): PropertyDecorator;
    /**
     * define property decorator with metadata map.
     * @param {T} [metadata] define matadata map to resolve value to the property.
     */
    (metadata?: T): PropertyDecorator;
    /**
     * define property decorator.
     */
    (target: object, propertyKey: string | symbol): void;
}


/**
 * create property decorator.
 *
 * @export
 * @template T metadata type.
 * @param {string} name decorator name.
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns
 */
export function createPropDecorator<T extends PropertyMetadata>(name: string, adapter?: MetadataAdapter, metadataExtends?: MetadataExtends<T>): IPropertyDecorator<T> {
    let propPropAdapter = ((args: ArgsIterator) => {
        if (adapter) {
            adapter(args);
        }
        args.next<T>({
            isMetadata: (arg) => isProvideMetadata(arg),
            match: (arg) => isToken(arg),
            setMetadata: (metadata, arg) => {
                metadata.provider = arg;
            }
        });
    });
    let decorator = createDecorator<T>(name, propPropAdapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Property;
    return decorator;
}


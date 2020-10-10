import 'reflect-metadata';
import { ParamPropMetadata } from '../metadatas';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { isToken, isProvideMetadata } from '../utils';
import { ArgsIterator } from './ArgsIterator';
import { Token } from '../types';


/**
 * property parameter decorator.
 */
export type PropParamDecorator = (target: Object, propertyKey: string | symbol, parameterIndex?: number | TypedPropertyDescriptor<any>) => void;

/**
 * Parameter and Property decorator.
 *
 * @export
 * @interface IParamPropDecorator
 */
export interface IParamPropDecorator<T extends ParamPropMetadata> {
    /**
     * define parameter or property decorator with param.
     *
     * @param {Token<T>} provider define provider to resolve value to the parameter or property.
     */
    (provider: Token): PropParamDecorator;
    /**
     * define parameter or property decorator with metadata map.
     * @param {T} [metadata] define matadata map to resolve value to the parameter or property.
     */
    (metadata?: T): PropParamDecorator;
    /**
     * define parameter or property decorator.
     */
    (target: object, propertyKey: string | symbol, parameterIndex?: number | TypedPropertyDescriptor<any>): void;
}

/**
 * create parameter or property decorator
 *
 * @export
 * @template T
 * @param {string} name
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns {IParamPropDecorator<T>}
 */
export function createParamPropDecorator<T extends ParamPropMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IParamPropDecorator<T> {
    let paramPropAdapter = ((args: ArgsIterator) => {
        if (adapter) {
            adapter(args);
        }
        args.next<T>({
            isMetadata: (arg) => isProvideMetadata(arg, 'index'),
            match: (arg) => isToken(arg),
            setMetadata: (metadata, arg) => {
                metadata.provider = arg;
            }
        });
    });
    let decorator = createDecorator<T>(name, paramPropAdapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Property | DecoratorType.Parameter;
    return decorator;
}


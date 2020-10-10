import 'reflect-metadata';
import { ParameterMetadata } from '../metadatas';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { isToken, isProvideMetadata } from '../utils';
import { ArgsIterator } from './ArgsIterator';
import { Token } from '../types';


/**
 * Parameter decorator.
 *
 * @export
 * @interface IParameterDecorator
 */
export interface IParameterDecorator<T extends ParameterMetadata> {
    /**
     * define parameter decorator with param.
     *
     * @param {Token<T>} provider define provider to resolve value to the parameter.
     */
    (provider: Token<T>): ParameterDecorator;
    /**
     * define parameter decorator with metadata map.
     * @param {T} [metadata] define matadata map to resolve value to the parameter.
     */
    (metadata?: T): ParameterDecorator;
    /**
     * define paramete decorator.
     */
    (target: object, propertyKey: string | symbol, parameterIndex: number): void;
}



/**
 * create parameter decorator.
 *
 * @export
 * @template T metadata type.
 * @param {string} name decorator name.
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns
 */
export function createParamDecorator<T extends ParameterMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IParameterDecorator<T> {

    let paramAdapter = ((args: ArgsIterator) => {
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
        // args.next<T>({
        //     match: (arg) => isString(arg),
        //     setMetadata: (metadata, arg) => {
        //         metadata.alias = arg;
        //     }
        // });
    });
    let decorator = createDecorator<T>(name, paramAdapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Parameter;
    return decorator;
}

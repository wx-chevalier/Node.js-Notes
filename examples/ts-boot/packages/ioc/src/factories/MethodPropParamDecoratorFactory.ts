import { TypeMetadata, MethodParamPropMetadata } from '../metadatas';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { ArgsIterator } from './ArgsIterator';
import { isProvideMetadata, isToken, isArray } from '../utils';
import { Token } from '../types';
import { PropParamDecorator } from './ParamPropDecoratorFactory';
import { ProviderTypes } from '../providers';



export type MethodPropParamDecorator = (target: Object, propertyKey: string | symbol, descriptor?: number | TypedPropertyDescriptor<any>) => void;
/**
 * method, property or parameter decorator.
 *
 * @export
 * @interface IMethodPropParamDecorator
 */
export interface IMethodPropParamDecorator<T extends TypeMetadata> {
    /**
     * define method, property or parameter decorator with metadata map.
     * @param {T} [metadata] metadata map
     */
    (metadata?: T): MethodPropParamDecorator;
    /**
     * define parameter or property decorator with param.
     *
     * @param {Token<T>} provider define provider to resolve value to the parameter or property.
     */
    (provider: Token): PropParamDecorator;

    /**
     * define method decorator with providers.
     *
     * @param {Token<T>} provider define providers to the method.
     */
    (providers: ProviderTypes[]): MethodDecorator;
    /**
     * define method, property or parameter decorator.
     */
    (target: object, propertyKey: string | symbol, descriptor?: number | TypedPropertyDescriptor<any>): void;
}

/**
 * create method, property or parameter decorator.
 *
 * @export
 * @template T
 * @param {string} name
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns {IMethodPropParamDecorator<T>}
 */
export function createMethodPropParamDecorator<T extends MethodParamPropMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    metadataExtends?: MetadataExtends<T>): IMethodPropParamDecorator<T> {

    let decorator = createDecorator<T>(name, (args: ArgsIterator) => {
        if (adapter) {
            adapter(args);
        }
        args.next<T>({
            isMetadata: (arg) => isProvideMetadata(arg, 'index'),
            match: (arg) => isToken(arg) || isArray(arg),
            setMetadata: (metadata, arg) => {
                if (isArray(arg)) {
                    metadata.providers = arg;
                } else {
                    metadata.provider = arg;
                }
            }
        });
    }, metadataExtends);
    decorator.decoratorType = DecoratorType.Method | DecoratorType.Property | DecoratorType.Parameter;
    return decorator;
}


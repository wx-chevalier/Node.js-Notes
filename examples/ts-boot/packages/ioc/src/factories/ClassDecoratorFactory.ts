import 'reflect-metadata';
import { ClassMetadata } from '../metadatas';
import { Type, Token, ProvideToken } from '../types';
import { createDecorator, MetadataAdapter, MetadataExtends } from './DecoratorFactory';
import { DecoratorType } from './DecoratorType';
import { isString, isNumber, isBoolean, isToken, isProvideToken } from '../utils';
import { ArgsIterator } from './ArgsIterator';

/**
 * Type decorator.
 *
 * @export
 * @interface ITypeDecorator
 * @template T
 */
export interface ITypeDecorator<T extends ClassMetadata> {
    /**
     * define class decorator setting with metadata map.
     *
     * @param {T} [metadata] metadata map.
     */
    (metadata?: T): ClassDecorator;
    /**
     * not allow abstract to decorator with out metadata.
     */
    (target: Type): void;
}

/**
 * class decorator.
 *
 * @export
 * @interface IClassDecorator
 */
export interface IClassDecorator<T extends ClassMetadata> extends ITypeDecorator<T> {

    /**
     * define class decorator setting with params.
     *
     * @param {ProvideToken} provide define this class provider for provide.
     * @param {string} [alias] define this class provider with alias for provide.
     */
    (provide: ProvideToken<any>): ClassDecorator;

    /**
     * define class decorator setting with params.
     *
     * @param {Token} provide define this class provider for provide.
     * @param {string} [alias] define this class provider with alias for provide.
     */
    (provide: Token, alias: string): ClassDecorator;

    /**
     * define class decorator setting with params.
     *
     * @param {Token} provide define this class provider for provide.
     * @param {string} [alias] define this class provider with alias for provide.
     * @param {Token} [refTarget]  define the class as service of target.
     */
    (provide: Token, alias: string, refTarget: Token): ClassDecorator;

    /**
     * define class decorator setting with params.
     *
     * @param {Token} provide define this class provider for provide.
     * @param {string} [alias] define this class provider with alias for provide.
     * @param {boolean} [singlton] define this class as singlton.
     * @param {Token} [refTarget]  define the class as service of target.
     */
    (provide: Token, alias: string, singlton: boolean, refTarget: Token): ClassDecorator;

    /**
     * define class decorator setting with params.
     *
     * @param {Token} provide define this class provider for provide.
     * @param {string} [alias] define this class provider with alias for provide.
     * @param {boolean} [singlton] define this class as singlton.
     * @param {number} [cache]  define class cahce expris when is not singlton.
     * @param {Token} [refTarget]  define the class as service of target.
     */
    (provide: Token, alias: string, cache: number, refTarget: Token): ClassDecorator;

}




/**
 * create class decorator
 *
 * @export
 * @template T metadata type.
 * @param {string} name decorator name.
 * @param {MetadataAdapter} [adapter]  metadata adapter
 * @param {MetadataExtends<T>} [metadataExtends] add extents for metadata.
 * @returns {*}
 */
export function createClassDecorator<T extends ClassMetadata>(name: string, adapter?: MetadataAdapter, metadataExtends?: MetadataExtends<T>): IClassDecorator<T> {

    let classAdapter = ((args: ArgsIterator) => {
        if (adapter) {
            adapter(args);
        }
        args.next<T>({
            match: (arg, args) => (args.length > 1) ? isToken(arg) : isProvideToken(arg),
            setMetadata: (metadata, arg) => {
                metadata.provide = arg;
            }
        });

        args.next<T>({
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.alias = arg;
            }
        });

        args.next<T>({
            match: (arg) => isBoolean(arg) || isNumber(arg) || isToken(arg),
            setMetadata: (metadata, arg) => {
                if (isBoolean(arg)) {
                    metadata.singleton = arg;
                } else if (isNumber(arg)) {
                    metadata.expires = arg;
                } else if (isToken(arg)) {
                    metadata.refs = { target: arg, provide: metadata.provide || metadata.type, alias: metadata.alias };
                }
            }
        });

        args.next<T>({
            match: (arg) => isToken(arg),
            setMetadata: (metadata, arg) => {
                metadata.expires = arg;
            }
        });
    });
    let decorator = createDecorator<T>(name, classAdapter, metadataExtends);
    decorator.decoratorType = DecoratorType.Class;
    return decorator;
}


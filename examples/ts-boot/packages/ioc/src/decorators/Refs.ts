import { createDecorator, ArgsIterator } from '../factories';
import { RefMetadata } from '../metadatas';
import { isToken, isString } from '../utils';
import { Token } from '../types';

/**
 * Refs decorator, for class. use to define the class as service of target.
 *
 * @Refs
 *
 * @export
 * @interface IRefToDecorator
 * @extends {IClassDecorator<RefMetadata>}
 */
export interface IRefsDecorator {
    /**
     * Refs decorator, for class. use to define the class as service of target.
     *
     * @Refs
     *
     * @param {Token} target reference to target token.
     */
    (target: Token): ClassDecorator;

    /**
     * Refs decorator, for class. use to define the class as service of target.
     *
     * @Refs
     *
     * @param {Token} target reference to target token.
     * @param {Token} provide define this class ref provider for provide.
     * @param {string} [alias] define this class ref provider with alias for provide.
    */
    (target: Token, provide: Token, alias?: string): ClassDecorator;

    /**
     * Refs decorator, for class. use to define the class as service of target.
     *
     * @Refs
     *
     * @param {RefMetadata} [metadata] metadata map.
     */
    (metadata: RefMetadata): ClassDecorator;
}

/**
 * Refs decorator, for class. use to define the class as service of target.
 *
 * @Refs
 */
export const Refs: IRefsDecorator = createDecorator<RefMetadata>('Refs', ((args: ArgsIterator) => {
    args.next<RefMetadata>({
        match: arg => isToken(arg),
        setMetadata: (metadata, arg) => {
            metadata.refs = { target: arg };
        }
    });
    args.next<RefMetadata>({
        match: arg => isToken(arg),
        setMetadata: (metadata, arg) => {
            metadata.refs.provide = arg;
        }
    });
    args.next<RefMetadata>({
        match: arg => isString(arg),
        setMetadata: (metadata, arg) => {
            metadata.refs.alias = arg;
        }
    });
})) as IRefsDecorator;


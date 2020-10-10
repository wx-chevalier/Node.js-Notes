import { createClassDecorator, ITypeDecorator } from '../factories';
import { ClassMetadata } from '../metadatas';
import { ProvideToken, Token } from '../types';

/**
 * Singleton decorator, for class. use to define the class is singleton.
 *
 * @Singleton
 *
 * @export
 * @interface ISingletonDecorator
 * @extends {IClassDecorator<ClassMetadata>}
 */
export interface ISingletonDecorator extends ITypeDecorator<ClassMetadata> {
    /**
     * Singleton decorator, for class. use to define the class is singleton.
     *
     * @Singleton
     *
     * @param {ProvideToken<any>} provide define this class provider for provide.
     */
    (provide: ProvideToken<any>): ClassDecorator;

    /**
     * Singleton decorator, for class. use to define the class is singleton.
     *
     * @Singleton
     *
     * @param {Token} provide define this class provider for provide.
     * @param {string} alias define this class provider with alias for provide.
     */
    (provide: Token, alias: string): ClassDecorator;

    /**
     * Singleton decorator, for class. use to define the class is singleton.
     *
     * @Singleton
     *
     * @param {ClassMetadata} [metadata] metadata map.
     */
    (metadata?: ClassMetadata): ClassDecorator;
}

/**
 * Singleton decorator, for class. use to define the class is singleton.
 *
 * @Singleton
 */
export const Singleton: ISingletonDecorator = createClassDecorator<ClassMetadata>('Singleton', null, (metadata) => {
    metadata.singleton = true;
    return metadata;
}) as ISingletonDecorator;


import { createClassDecorator, ITypeDecorator, Registration, Type, isString, isClass, isArray, ClassType } from '@tsdi/ioc';
import { AspectMetadata } from '../metadatas';

/**
 * Aspect decorator
 *
 * @export
 * @interface IAspectDecorator
 * @extends {ITypeDecorator<AspectMetadata>}
 */
export interface IAspectDecorator extends ITypeDecorator<AspectMetadata> {
    /**
     * Aspect decorator, define for class.  use to define class as aspect. it can setting provider to some token, singleton or not.
     *
     * @Aspect
     *
     * @param {string} annotation set pointcut in the class with the annotation decorator only.
     * @param {(ClassType | ClassType[])>} [within]  set pointcut in the class with the annotation decorator only.
     * @param {(Registration | symbol | string)} [provide] define this class provider for provide.
     * @param {string} [alias] define this class provider with alias for provide.
     * @param {boolean} [singlton] define this class as singlton.
     * @param {number} [cache]  define class cahce expris when is not singlton.
     */
    (annotation: string, within?: ClassType | ClassType[], provide?: Registration | symbol | string, alias?: string, singlton?: boolean, cache?: number): ClassDecorator;

    /**
     * Aspect decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
     *
     * @Aspect
     *
     * @param {AspectMetadata} [metadata] metadata map.
     */
    (metadata?: AspectMetadata): ClassDecorator;
}


/**
 * Aspect decorator. define aspect service.
 *
 * @Aspect
 */
export const Aspect: IAspectDecorator = createClassDecorator<AspectMetadata>('Aspect', args => {
    args.next<AspectMetadata>({
        match: (arg) => isString(arg),
        setMetadata: (metadata, arg) => {
            metadata.annotation = arg;
        }
    });

    args.next<AspectMetadata>({
        match: (arg) => isArray(arg) || isClass(arg),
        setMetadata: (metadata, arg) => {
            metadata.within = arg;
        }
    });
}) as IAspectDecorator;


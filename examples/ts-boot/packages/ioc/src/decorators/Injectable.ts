import { createClassDecorator, IClassDecorator } from '../factories';
import { InjectableMetadata } from '../metadatas';

/**
 * Injectable decorator
 *
 * @export
 * @interface IInjectableDecorator
 * @extends {IClassDecorator<InjectableMetadata>}
 */
export interface IInjectableDecorator extends IClassDecorator<InjectableMetadata> {
    /**
     * Injectable decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
     *
     * @Injectable
     *
     * @param {InjectableMetadata} [metadata] metadata map.
     */
    (metadata?: InjectableMetadata): ClassDecorator;
}


/**
 * Injectable decorator, define for class.  use to define the class. it can setting provider to some token, singleton or not.
 *
 * @Injectable
 */
export const Injectable: IInjectableDecorator = createClassDecorator<InjectableMetadata>('Injectable');


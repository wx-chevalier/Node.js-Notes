import { createDecorator, ArgsIterator, ClassMethodDecorator } from '../factories';
import { ProvidersMetadata } from '../metadatas';
import { isArray } from '../utils';
import { ProviderTypes } from '../providers';

/**
 * @Providers decorator, for class. use to define the class as service of target.
 *
 * @Providers
 *
 * @export
 * @interface IProvidersDecorator
 * @extends {IClassDecorator<ProvidersMetadata>}
 */
export interface IProvidersDecorator {
    /**
     * Providers decorator, for class. use to add ref service to the class.
     *
     * @Providers
     *
     * @param {(Registration | symbol | string)} providers provider reference service to target.
     */
    (providers: ProviderTypes[]): ClassMethodDecorator;

    /**
     * Providers decorator, for class. use to add ref service to the class.
     *
     * @Providers
     *
     * @param {ProvidersMetadata} [metadata] metadata map.
     */
    (metadata: ProvidersMetadata): ClassMethodDecorator;
}

/**
 * Providers decorator, for class. use to add ref service to the class.
 *
 * @Providers
 */
export const Providers: IProvidersDecorator = createDecorator<ProvidersMetadata>('Providers', ((args: ArgsIterator) => {
    args.next<ProvidersMetadata>({
        match: arg => isArray(arg),
        setMetadata: (metadata, arg) => {
            metadata.providers = arg;
        }
    });
})) as IProvidersDecorator;


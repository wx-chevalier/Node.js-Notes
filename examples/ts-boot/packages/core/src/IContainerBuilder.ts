import { IContainer } from './IContainer';
import { InjectToken, LoadType, Modules } from '@tsdi/ioc';

/**
 * ContainerBuilder interface token.
 * it is a token id, you can register yourself IContainerBuilder for this.
 */
export const ContainerBuilderToken = new InjectToken<IContainerBuilder>('DI_IContainerBuilder');

/**
 * container builder.
 *
 * @export
 * @interface IContainerBuilder
 */
export interface IContainerBuilder {

    /**
     * create a new container.
     *
     * @returns {IContainer}
     * @memberof IContainerBuilder
     */
    create(): IContainer;

    /**
     * create a new container and load module via options.
     *
     * @param {...LoadType[]} modules
     * @param {string} [basePath]
     * @returns {Promise<IContainer>}
     * @memberof IContainerBuilder
     */
    build(...modules: LoadType[]): Promise<IContainer>;

    /**
     * build container in sync.
     *
     * @param {LoadOptions} options
     * @returns {IContainer}
     * @memberof IContainerBuilder
     */
    syncBuild(...modules: Modules[]): IContainer;

}

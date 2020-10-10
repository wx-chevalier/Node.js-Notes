import { IContainer } from './IContainer';
import { Container } from './Container';
import { IContainerBuilder, ContainerBuilderToken } from './IContainerBuilder';
import { Modules, LoadType } from '@tsdi/ioc';
import { IModuleLoader, ModuleLoader } from './services';

/**
 * default container builder.
 *
 * @export
 * @class DefaultContainerBuilder
 * @implements {IContainerBuilder}
 */
export class ContainerBuilder implements IContainerBuilder {

    private _loader?: IModuleLoader
    constructor(loader?: IModuleLoader) {
        this._loader = loader;
    }

    create(): IContainer {
        let container = new Container();
        container.bindProvider(ContainerBuilderToken, () => this);
        if (this._loader) {
            container.bindProvider(ModuleLoader, () => this._loader);
        }
        return container;
    }

    /**
     * build container.
     *
     * @param {...LoadType[]} [modules]
     * @returns
     * @memberof DefaultContainerBuilder
     */
    async build(...modules: LoadType[]) {
        let container: IContainer = this.create();
        if (modules.length) {
            await container.load(container, ...modules);
        }
        return container;
    }

    syncBuild(...modules: Modules[]): IContainer {
        let container: IContainer = this.create();
        if (modules.length) {
            container.use(...modules);
        }
        return container;
    }

    protected getLoader(container: IContainer): IModuleLoader {
        return container.get(ModuleLoader) || this._loader;
    }

}

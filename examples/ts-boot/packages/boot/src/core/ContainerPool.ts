import { Token, SymbolType, Registration, IIocContainer, ProviderTypes, IocContainerToken } from '@tsdi/ioc';
import { IContainer, IContainerBuilder, Container, ContainerToken } from '@tsdi/core';
import { BootModule } from './BootModule';
import { ParentContainerToken, ContainerPoolToken, RootContainerToken, IContainerPool } from './ContainerPoolToken';
import { HandleRegisterer, StartupDecoratorRegisterer } from './handles';
import { DIModuleExports } from './injectors';

/**
 * module container.
 *
 * @export
 * @class ModuleContainer
 * @extends {Container}
 */
export class ModuleContainer extends Container {
    constructor(root: IContainer) {
        super();
        this.bindRoot(root);
    }

    protected bindRoot(root: IContainer) {
        root.iterator((fac, tk) => {
            this.bindProvider(tk, (...providers: ProviderTypes[]) => root.get(tk, ...providers));
        });
        this.bindProvider(ContainerToken, () => this);
        this.bindProvider(IocContainerToken, () => this);
    }

    init() {
        // no init.
    }
}

/**
 * container pool
 *
 * @export
 * @class ContainerPool
 */
export class ContainerPool implements IContainerPool {
    protected pools: IContainer[];
    protected root: IContainer;
    constructor(protected containerBuilder: IContainerBuilder) {
        this.pools = [];
        this.createContainer();
    }

    protected createContainer(parent?: IContainer): IContainer {
        let container = parent ? new ModuleContainer(this.root) : this.containerBuilder.create();
        this.pools.push(container);
        if (!this.root) {
            this.root = container;
        } else {
            this.setParent(container, parent || this.root);
        }
        this.initContainer(container);
        return container;
    }

    protected initContainer(container: IContainer) {
        container.bindProvider(RootContainerToken, this.root);
        container.bindProvider(ContainerPoolToken, () => this);
        container.bindProvider(ContainerPool, () => this);
        if (this.isRoot(container)) {
            container.registerSingleton(HandleRegisterer, () => new HandleRegisterer());
            container.registerSingleton(StartupDecoratorRegisterer, () => new StartupDecoratorRegisterer(container));
            container.register(BootModule);
        }
        container.register(DIModuleExports);
    }

    getTokenKey(token: Token): SymbolType {
        if (token instanceof Registration) {
            return token.toString();
        }
        return token;
    }

    isRoot(container: IContainer): boolean {
        return container === this.root;
    }


    getRoot(): IContainer {
        return this.root;
    }

    getContainers(): IContainer[] {
        return this.pools;
    }

    has(container: IContainer): boolean {
        return this.pools.indexOf(container) >= 0;
    }

    hasParent(container: IContainer): boolean {
        return container && container.has(ParentContainerToken);
    }


    create(parent?: IContainer): IContainer {
        let container = this.createContainer(parent);
        return container;
    }

    setParent(container: IContainer, parent?: IContainer) {
        if (this.isRoot(container)) {
            return;
        }
        if (!container.has(ContainerPoolToken)) {
            container.bindProvider(ContainerPoolToken, () => this);
            container.bindProvider(ContainerPool, () => this);
        }
        parent = parent || this.root;
        if (parent !== container) {
            container.bindProvider(ParentContainerToken, parent);
        }
    }

    getParent(container: IIocContainer): IContainer {
        return container.resolve(ParentContainerToken);
    }

    iterator(express: (resolvor?: IContainer) => void | boolean): void | boolean {
        return !this.pools.some(r => {
            if (express(r) === false) {
                return true;
            }
            return false;
        })
    }
}


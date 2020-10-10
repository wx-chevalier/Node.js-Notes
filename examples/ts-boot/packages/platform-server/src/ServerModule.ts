import { IocExt, ContainerToken, IContainer, ModuleLoader } from '@tsdi/core';
import { NodeModuleLoader } from './NodeModuleLoader';
import { Inject } from '@tsdi/ioc';

/**
 * server module for ioc. auto run setup after registered.
 * with @IocExt('setup') decorator.
 * @export
 * @class ServerModule
 */
@IocExt('setup')
export class ServerModule {

    constructor() {

    }

    /**
     * register aop for container.
     *
     * @memberof AopModule
     */
    setup(@Inject(ContainerToken) container: IContainer) {
        container.bindProvider(ModuleLoader, new NodeModuleLoader());
    }
}

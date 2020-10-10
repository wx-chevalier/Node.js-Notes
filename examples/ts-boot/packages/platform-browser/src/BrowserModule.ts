import 'core-js';
import { IocExt, ContainerToken, IContainer, ModuleLoader } from '@tsdi/core';
import { BrowserModuleLoader } from './BrowserModuleLoader';
import { Inject } from '@tsdi/ioc';


/**
 * browser module for ioc. auto run setup after registered.
 * with @IocExt('setup') decorator.
 * @export
 * @class BrowserModule
 */
@IocExt('setup')
export class BrowserModule {

    constructor() {

    }

    /**
     * register aop for container.
     *
     * @memberof AopModule
     */
    setup(@Inject(ContainerToken) container: IContainer) {
        container.bindProvider(ModuleLoader,  new BrowserModuleLoader());
    }
}

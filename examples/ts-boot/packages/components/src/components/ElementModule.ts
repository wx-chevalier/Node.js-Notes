import { IocExt, ContainerToken, IContainer } from '@tsdi/core';
import { Inject, DecoratorProvider } from '@tsdi/ioc';
import { Component } from '../decorators';
import { ComponentSelectorHandle, ValidComponentHandle, BindingComponentHandle } from './handles';
import { ElementNode } from './ElementNode';
import { HandleRegisterer, StartupDecoratorRegisterer, StartupScopes } from '@tsdi/boot';
import { RefSelector } from '../RefSelector';
import { RefElementSelector } from './RefElementSelector';

/**
 * component element module.
 *
 * @export
 * @class ElementModule
 */
@IocExt('setup')
export class ElementModule {

    constructor() {

    }

    setup(@Inject(ContainerToken) container: IContainer) {
        container.register(RefElementSelector);
        container.get(StartupDecoratorRegisterer)
            .register(Component, StartupScopes.TranslateTemplate, ComponentSelectorHandle)
            .register(Component, StartupScopes.ValifyComponent, ValidComponentHandle)
            .register(Component, StartupScopes.Binding, BindingComponentHandle);

        container.get(HandleRegisterer)
            .register(container, ComponentSelectorHandle)
            .register(container, ValidComponentHandle)
            .register(container, BindingComponentHandle);

        container.get(DecoratorProvider)
            .bindProviders(Component, { provide: RefSelector, useClass: RefElementSelector })

        container.register(ElementNode);
    }
}

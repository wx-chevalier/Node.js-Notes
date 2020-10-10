import { IContainer, IocExt, ContainerToken } from '@tsdi/core';
import {
    BindProviderAction, IocSetCacheAction, DesignDecoratorRegisterer,
    RuntimeDecoratorRegisterer, DecoratorScopes, RegisterSingletionAction, Inject, DecoratorProvider
} from '@tsdi/ioc';
import { Component, Input, Output, RefChild } from './decorators';
import { SelectorManager } from './SelectorManager';
import { ComponentManager } from './ComponentManager';
import { ComponentRegisterAction, BindingPropertyTypeAction, BindingParamTypeAction, BindingCache, BindingCacheFactory } from './registers';
import { HandleRegisterer, ResolveMoudleScope, ResolveModuleHandle, BootTargetAccessor } from '@tsdi/boot';
import { BindingArgsHandle } from './resovers/BindingArgsHandle';
import {
    BindingPropertyHandle, ModuleAfterInitHandle, ResolveTemplateScope,
    BindingTemplateHandle, ModuleAfterContentInitHandle, ModuleBeforeInitHandle, ValifyTeamplateHandle
} from './resovers';
import { BindingScope, TemplateParseScope } from './parses';
import { ComponentDecoratorService } from './ComponentDecoratorService';
import { ComponentBuilder } from './ComponentBuilder';
import { BootComponentAccessor } from './BootComponentAccessor';


/**
 * components module.
 *
 * @export
 * @class ComponentsModule
 */
@IocExt('setup')
export class ComponentsModule {

    setup(@Inject(ContainerToken) container: IContainer) {

        container.register(SelectorManager)
            .register(ComponentManager)
            .register(BootComponentAccessor)
            .register(ComponentDecoratorService);

        container.getActionRegisterer()
            .register(container, ComponentRegisterAction)
            .register(container, BindingPropertyTypeAction)
            .register(container, BindingParamTypeAction);

        container.get(DecoratorProvider)
            .bindProviders(Input, {
                provide: BindingCache,
                useFactory: () => new BindingCacheFactory(ref => {
                    if (!ref.propInBindings) {
                        ref.propInBindings = new Map();
                    }
                    return ref.propInBindings;
                })
            })
            .bindProviders(Output, {
                provide: BindingCache,
                useFactory: () => new BindingCacheFactory(ref => {
                    if (!ref.propOutBindings) {
                        ref.propOutBindings = new Map();
                    }
                    return ref.propOutBindings;
                })
            })
            .bindProviders(RefChild, {
                provide: BindingCache,
                useFactory: () => new BindingCacheFactory(ref => {
                    if (!ref.propRefChildBindings) {
                        ref.propRefChildBindings = new Map();
                    }
                    return ref.propRefChildBindings;
                })
            })
            .bindProviders(Component, { provide: BootTargetAccessor, useClass: BootComponentAccessor });

        container.resolve(HandleRegisterer)
            .register(container, BindingScope, true)
            .register(container, TemplateParseScope, true)
            .get(ResolveMoudleScope)
            .useBefore(BindingArgsHandle, ResolveModuleHandle)
            .use(ModuleBeforeInitHandle)
            .use(BindingPropertyHandle)
            .use(ModuleAfterInitHandle)
            .use(ResolveTemplateScope)
            .use(ValifyTeamplateHandle)
            .use(BindingTemplateHandle)
            .use(ModuleAfterContentInitHandle);

        container.resolve(DesignDecoratorRegisterer)
            .register(Component, DecoratorScopes.Class, BindProviderAction, ComponentRegisterAction)
            .register(Input, DecoratorScopes.Property, BindingPropertyTypeAction)
            .register(Output, DecoratorScopes.Property, BindingPropertyTypeAction)
            .register(RefChild, DecoratorScopes.Property, BindingPropertyTypeAction);

        container.resolve(RuntimeDecoratorRegisterer)
            .register(Component, DecoratorScopes.Class, RegisterSingletionAction, IocSetCacheAction)
            .register(Input, DecoratorScopes.Parameter, BindingParamTypeAction);

        container.register(ComponentBuilder);
    }

}

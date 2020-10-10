import { Task } from './decorators/Task';
import { RunAspect } from './aop';
import * as core from './core';
import * as activites from './activities';
import { IContainer, ContainerToken, IocExt } from '@tsdi/core';
import { Inject, BindProviderAction, DesignDecoratorRegisterer, DecoratorScopes, DecoratorProvider, InjectReference, ProviderTypes } from '@tsdi/ioc';
import { HandleRegisterer, BootContext, StartupDecoratorRegisterer, StartupScopes, BootTargetAccessor } from '@tsdi/boot';
import { ComponentRegisterAction, BootComponentAccessor } from '@tsdi/components'
import { TaskInjectorRegisterAction, ActivityContext } from './core';
import { TaskDecorSelectorHandle, BindingTaskComponentHandle, ValidTaskComponentHandle } from './handles';


/**
 * setup wokflow activity module for boot application.
 *
 * @export
 * @param {IContainer} container
 */
@IocExt('setup')
export class ActivityModule {
    constructor() {
    }

    setup(@Inject(ContainerToken) container: IContainer) {

        container.getActionRegisterer()
            .register(container, TaskInjectorRegisterAction, true);

        container.get(HandleRegisterer)
            .register(container, ValidTaskComponentHandle)
            .register(container, BindingTaskComponentHandle)
            .register(container, TaskDecorSelectorHandle);

        container.get(DecoratorProvider)
            .bindProviders(Task, { provide: BootTargetAccessor, useClass: BootComponentAccessor})


        container.get(DesignDecoratorRegisterer)
            .register(Task, DecoratorScopes.Class, BindProviderAction, ComponentRegisterAction)
            .register(Task, DecoratorScopes.Injector, TaskInjectorRegisterAction);

        container.get(StartupDecoratorRegisterer)
            .register(Task, StartupScopes.TranslateTemplate, TaskDecorSelectorHandle)
            .register(Task, StartupScopes.ValifyComponent, ValidTaskComponentHandle)
            .register(Task, StartupScopes.Binding, BindingTaskComponentHandle);

        container.use(core)
            .use(RunAspect)
            .use(activites);

        container.get(DecoratorProvider)
            .bindProviders(Task, {
                provide: BootContext,
                deps: [ContainerToken],
                useFactory: (container: IContainer, ...providers: ProviderTypes[]) => {
                    let ref = new InjectReference(BootContext, Task.toString());
                    if (container.has(ref)) {
                        return container.get(ref, ...providers);
                    } else {
                        return container.get(ActivityContext, ...providers);
                    }
                }
            });
    }
}

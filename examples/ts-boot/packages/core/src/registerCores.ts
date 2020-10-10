import { IContainer, ContainerToken } from './IContainer';
import { ModuleLoader } from './services';
import { IocExt } from './decorators';
import {
    RuntimeDecoratorRegisterer, IocAutorunAction, DecoratorScopes,
    RegisterSingletionAction, DesignDecoratorRegisterer
} from '@tsdi/ioc';
import { InjectorLifeScope } from './injectors';
import { ServiceResolveLifeScope, ServicesResolveLifeScope } from './resolves';



export function registerCores(container: IContainer) {

    container.bindProvider(ContainerToken, () => container);
    if (!container.has(ModuleLoader)) {
        container.register(ModuleLoader);
    }

    // register action
    container.getActionRegisterer()
        .register(container, InjectorLifeScope, true)
        .register(container, ServiceResolveLifeScope, true)
        .register(container, ServicesResolveLifeScope, true);

    container.get(RuntimeDecoratorRegisterer)
        .register(IocExt, DecoratorScopes.Class, RegisterSingletionAction);

    container.get(DesignDecoratorRegisterer)
        .register(IocExt, DecoratorScopes.Class, IocAutorunAction);

}

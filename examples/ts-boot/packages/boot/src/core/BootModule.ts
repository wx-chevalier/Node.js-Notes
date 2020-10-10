import {
    Inject, BindProviderAction, DesignDecoratorRegisterer,
    IocSetCacheAction, RuntimeDecoratorRegisterer, DesignLifeScope,
    IocBeforeConstructorScope, IocAfterConstructorScope, DecoratorScopes, RuntimeMethodScope,
    RuntimePropertyScope, RuntimeAnnoationScope, IocAutorunAction,
    RegisterSingletionAction, IocResolveScope
} from '@tsdi/ioc';
import {
    IContainer, ContainerToken, IocExt,
    ResolvePrivateServiceAction, ResolveServiceInClassChain,
    ServicesResolveLifeScope, TypesRegisterScope, IocExtRegisterScope
} from '@tsdi/core';
import { DIModule } from './decorators/DIModule';
import { Annotation } from './decorators/Annotation';
import * as modules from './modules';
import * as messages from './messages';

import { RouteResolveAction, ResolveRouteServiceAction, ResolveRouteServicesAction } from './resolves';
import { RouteDesignRegisterAction, RouteRuntimRegisterAction, MessageRegisterAction } from './registers';
import { DIModuleInjectorScope, ModuleInjectLifeScope, RegForInjectorAction } from './injectors';
import { Message } from './decorators';
import { ModuleDecoratorService } from './ModuleDecoratorService';


/**
 * Bootstrap ext for ioc. auto run setup after registered.
 * with @IocExt('setup') decorator.
 * @export
 * @class BootModule
 */
@IocExt('setup')
export class BootModule {

    constructor() {

    }

    /**
     * register aop for container.
     *
     * @memberof AopModule
     */
    setup(@Inject(ContainerToken) container: IContainer) {

        let registerer = container.getActionRegisterer();

        registerer
            .register(container, ModuleInjectLifeScope, true)
            .register(container, DIModuleInjectorScope, true)
            .register(container, RegForInjectorAction)
            .register(container, MessageRegisterAction);

        // inject module
        registerer.get(TypesRegisterScope)
            .useBefore(RegForInjectorAction);
        registerer.get(IocExtRegisterScope)
            .useBefore(RegForInjectorAction);

        container.use(ModuleDecoratorService);

        container.get(DesignDecoratorRegisterer)
            .register(DIModule, DecoratorScopes.Injector, DIModuleInjectorScope)
            .register(Annotation, DecoratorScopes.Class, BindProviderAction, IocAutorunAction)
            .register(DIModule, DecoratorScopes.Class, BindProviderAction, IocAutorunAction)
            .register(Message, DecoratorScopes.Class, BindProviderAction, MessageRegisterAction);

        container.get(RuntimeDecoratorRegisterer)
            .register(Annotation, DecoratorScopes.Class, RegisterSingletionAction, IocSetCacheAction)
            .register(DIModule, DecoratorScopes.Class, RegisterSingletionAction, IocSetCacheAction);

        container.use(modules, messages);
        // container.register(DIModuleExports);


        // route service
        registerer.get(ResolveServiceInClassChain)
            .useAfter(ResolveRouteServiceAction, ResolvePrivateServiceAction, true);

        // route services
        registerer.get(ServicesResolveLifeScope)
            .use(ResolveRouteServicesAction, true);

        registerer.get(IocResolveScope)
            .use(RouteResolveAction, true);

        // design register route.
        registerer.get(DesignLifeScope)
            .use(RouteDesignRegisterAction);

        // runtime register route.
        registerer.get(IocBeforeConstructorScope)
            .use(RouteRuntimRegisterAction);

        registerer.get(IocAfterConstructorScope)
            .use(RouteRuntimRegisterAction);

        registerer.get(RuntimePropertyScope)
            .use(RouteRuntimRegisterAction);

        registerer.get(RuntimeMethodScope)
            .use(RouteRuntimRegisterAction);

        registerer.get(RuntimeAnnoationScope)
            .use(RouteRuntimRegisterAction);

    }
}

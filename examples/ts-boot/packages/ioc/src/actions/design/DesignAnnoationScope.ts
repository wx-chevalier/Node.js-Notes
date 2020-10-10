import { DesignDecoratorScope } from './DesignDecoratorScope';
import { IocRegisterScope } from '../IocRegisterScope';
import { DesignActionContext } from './DesignActionContext';
import { Injectable, Singleton, Providers, Refs, Autorun } from '../../decorators';
import { BindProviderAction } from './BindProviderAction';
import { IocAutorunAction } from './IocAutorunAction';
import { DesignDecoratorRegisterer, DecoratorScopes } from '../DecoratorRegisterer';

export class DesignAnnoationScope extends IocRegisterScope<DesignActionContext> {
    setup() {
        this.registerAction(BindProviderAction)
            .registerAction(IocAutorunAction);

        this.container.get(DesignDecoratorRegisterer)
            .register(Injectable, DecoratorScopes.Class, BindProviderAction)
            .register(Singleton, DecoratorScopes.Class, BindProviderAction)
            .register(Providers, DecoratorScopes.Class, BindProviderAction)
            .register(Refs, DecoratorScopes.Class, BindProviderAction)
            .register(Autorun, DecoratorScopes.Class, IocAutorunAction);

        this.use(DesignClassDecoratorScope, true);
    }
}

export class DesignClassDecoratorScope extends DesignDecoratorScope {
    protected getDecorScope(): DecoratorScopes {
        return DecoratorScopes.Class;
    }
}

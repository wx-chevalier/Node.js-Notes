import { RuntimeDecoratorScope } from './RuntimeDecoratorScope';
import { IocRegisterScope } from '../IocRegisterScope';
import { RuntimeActionContext } from './RuntimeActionContext';
import { RuntimeDecoratorRegisterer, DecoratorScopes } from '../DecoratorRegisterer';
import { Singleton, Injectable } from '../../decorators';
import { RegisterSingletionAction } from './RegisterSingletionAction';
import { IocSetCacheAction } from './IocSetCacheAction';

export class RuntimeAnnoationScope extends IocRegisterScope<RuntimeActionContext> {
    setup() {
        this.registerAction(RegisterSingletionAction)
            .registerAction(IocSetCacheAction);

        this.container.get(RuntimeDecoratorRegisterer)
            .register(Singleton, DecoratorScopes.Class, RegisterSingletionAction)
            .register(Injectable, DecoratorScopes.Class, RegisterSingletionAction, IocSetCacheAction);


        this.use(RuntimeAnnoationDecorScope, true);
    }
}

export class RuntimeAnnoationDecorScope extends RuntimeDecoratorScope {
    protected getDecorScope(): DecoratorScopes {
        return DecoratorScopes.Class;
    }
}

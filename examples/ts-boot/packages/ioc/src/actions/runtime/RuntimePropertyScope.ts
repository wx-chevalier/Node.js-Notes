import { RuntimeDecoratorScope } from './RuntimeDecoratorScope';
import { IocRegisterScope } from '../IocRegisterScope';
import { RuntimeActionContext } from './RuntimeActionContext';
import { RuntimeDecoratorRegisterer, DecoratorScopes } from '../DecoratorRegisterer';
import { Inject, AutoWired } from '../../decorators';
import { InjectPropertyAction } from './InjectPropertyAction';


export class RuntimePropertyScope extends IocRegisterScope<RuntimeActionContext> {
    setup() {
        this.registerAction(InjectPropertyAction);

        this.container.get(RuntimeDecoratorRegisterer)
            .register(Inject, DecoratorScopes.Property, InjectPropertyAction)
            .register(AutoWired, DecoratorScopes.Property, InjectPropertyAction);

        this.use(RuntimePropertyDecorScope, true);
    }
}

export class RuntimePropertyDecorScope extends RuntimeDecoratorScope {
    protected getDecorScope(): DecoratorScopes {
        return DecoratorScopes.Property;
    }
}


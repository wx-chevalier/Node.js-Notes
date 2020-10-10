import { RuntimeDecoratorScope } from './RuntimeDecoratorScope';
import { IocRegisterScope } from '../IocRegisterScope';
import { RuntimeActionContext } from './RuntimeActionContext';
import { RuntimeDecoratorRegisterer, DecoratorScopes } from '../DecoratorRegisterer';
import { Autorun } from '../../decorators';
import { MethodAutorunAction } from './MethodAutorunAction';

export class RuntimeMethodScope extends IocRegisterScope<RuntimeActionContext> {
    setup() {
        this.registerAction(MethodAutorunAction);

        this.container.get(RuntimeDecoratorRegisterer)
            .register(Autorun, DecoratorScopes.Method, MethodAutorunAction);
        this.use(RuntimeMethodDecorScope, true);
    }
}

export class RuntimeMethodDecorScope extends RuntimeDecoratorScope {
    protected getDecorScope(): DecoratorScopes {
        return DecoratorScopes.Method;
    }
}

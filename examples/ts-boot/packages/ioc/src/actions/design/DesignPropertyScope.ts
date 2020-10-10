import { DesignDecoratorScope } from './DesignDecoratorScope';
import { DesignActionContext } from './DesignActionContext';
import { IocRegisterScope } from '../IocRegisterScope';
import { DesignDecoratorRegisterer, DecoratorScopes } from '../DecoratorRegisterer';
import { BindPropertyTypeAction } from './BindPropertyTypeAction';
import { Inject, AutoWired } from '../../decorators';

export class DesignPropertyScope extends IocRegisterScope<DesignActionContext> {

    setup() {
        this.registerAction(BindPropertyTypeAction);

        this.container.get(DesignDecoratorRegisterer)
            .register(Inject, DecoratorScopes.Property, BindPropertyTypeAction)
            .register(AutoWired, DecoratorScopes.Property, BindPropertyTypeAction);

        this.use(DesignPropertyDecoratorScope, true);
    }
}


export class DesignPropertyDecoratorScope extends DesignDecoratorScope {
    protected getDecorScope(): DecoratorScopes {
        return DecoratorScopes.Property;
    }
}

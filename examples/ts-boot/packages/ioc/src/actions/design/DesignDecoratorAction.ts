import { ExecDecoratorAtion } from '../ExecDecoratorAtion';
import { DecoratorScopeRegisterer, DesignDecoratorRegisterer } from '../DecoratorRegisterer';

export class DesignDecoratorAction extends ExecDecoratorAtion {
    protected getScopeRegisterer(): DecoratorScopeRegisterer {
        return this.container.get(DesignDecoratorRegisterer);
    }
}

import { ExecDecoratorAtion } from '../ExecDecoratorAtion';
import { DecoratorScopeRegisterer, RuntimeDecoratorRegisterer } from '../DecoratorRegisterer';

/**
 * runtime decorator action.
 *  the register type class can only, register to ioc.
 * ` container.registerSingleton(RouteRuntimRegisterAction, () => new RouteRuntimRegisterAction(container));`
 *
 * @export
 * @class RuntimeDecoratorAction
 * @extends {ExecDecoratorAtion}
 */
export class RuntimeDecoratorAction extends ExecDecoratorAtion {
    protected getScopeRegisterer(): DecoratorScopeRegisterer {
        return this.container.get(RuntimeDecoratorRegisterer);
    }
}

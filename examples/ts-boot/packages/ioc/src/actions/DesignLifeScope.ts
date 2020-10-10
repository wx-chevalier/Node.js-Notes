import { DesignDecoratorRegisterer } from './DecoratorRegisterer';
import { RegisterLifeScope } from './RegisterLifeScope';
import { DesignActionContext, DesignDecoratorAction, DesignPropertyScope, DesignMethodScope, DesignAnnoationScope } from './design';
import { InitReflectAction } from './InitReflectAction';


/**
 * life scope of design.
 *
 * @export
 * @class DesignLifeScope
 * @extends {LifeScope}
 */
export class DesignLifeScope extends RegisterLifeScope<DesignActionContext> {

    setup() {
        this.container.registerSingleton(DesignDecoratorRegisterer, () => new DesignDecoratorRegisterer(this.container));
        this.registerAction(DesignDecoratorAction);

        this.use(InitReflectAction)
            .use(DesignPropertyScope, true)
            .use(DesignMethodScope, true)
            .use(DesignAnnoationScope, true);
    }
}

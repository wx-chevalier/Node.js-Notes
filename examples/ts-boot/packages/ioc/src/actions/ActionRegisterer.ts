import { Type } from '../types';
import { IocAction } from './Action';
import { IIocContainer } from '../IIocContainer';
import { IocCompositeAction } from './IocCompositeAction';
import { IocCoreService } from '../services';

/**
 * action registerer.
 *
 * @export
 * @class ActionRegisterer
 */
export class ActionRegisterer<T = IocAction> extends IocCoreService {
    private maps: Map<Type<T>, T>;

    constructor() {
        super()
        this.maps = new Map();
    }

    has(type: Type<T>): boolean {
        return this.maps.has(type);
    }

    get<TAction extends T>(type: Type<TAction>): TAction {
        if (this.maps.has(type)) {
            return this.maps.get(type) as TAction;
        }
        return null;
    }

    register(container: IIocContainer, action: Type<T>, setup?: boolean): this {
        // if (!isClass(action)) {
        //     return this;
        // }
        if (this.maps.has(action)) {
            return this;
        }
        let instance = new action(container);
        this.maps.set(action, instance);
        if (setup) {
            this.setup(instance);
        }
        return this;
    }

    protected setup(action: T) {
        if (action instanceof IocCompositeAction) {
            action.setup();
        }
    }
}

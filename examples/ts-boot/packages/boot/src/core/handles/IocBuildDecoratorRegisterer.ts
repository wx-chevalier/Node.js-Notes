import { DecoratorRegisterer, IIocContainer, isFunction, isClass, PromiseUtil } from '@tsdi/ioc';
import { BuildHandle, HandleRegisterer } from './BuildHandles';
import { IHandle } from './Handle';


export class IocBuildDecoratorRegisterer<T extends IHandle> extends DecoratorRegisterer<T, PromiseUtil.ActionHandle> {

    toFunc(container: IIocContainer, ac: T): PromiseUtil.ActionHandle {
        if (isClass(ac)) {
            let action = container.get(HandleRegisterer).get(ac);
            return action instanceof BuildHandle ? action.toAction() : null;

        } else if (ac instanceof BuildHandle) {
            return ac.toAction();
        }
        return isFunction(ac) ? <any>ac : null;
    }
}

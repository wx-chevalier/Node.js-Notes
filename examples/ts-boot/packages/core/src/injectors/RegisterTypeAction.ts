import { isClass } from '@tsdi/ioc';
import { InjectorAction } from './InjectorAction';
import { InjectorActionContext } from './InjectorActionContext';

export class RegisterTypeAction extends InjectorAction {
    execute(ctx: InjectorActionContext, next: () => void): void {
        if (isClass(ctx.currType)) {
            ctx.getRaiseContainer().register(ctx.currType);
            ctx.registered.push(ctx.currType);
        }
        next();
    }
}

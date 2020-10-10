import { InjectorAction } from './InjectorAction';
import { InjectorActionContext } from './InjectorActionContext';
import { DesignDecoratorRegisterer, DecoratorScopes } from '@tsdi/ioc';

export class DecoratorInjectAction extends InjectorAction {
    execute(ctx: InjectorActionContext, next?: () => void): void {
        if (ctx.currDecoractor) {
            let decRgr = this.container.get(DesignDecoratorRegisterer).getRegisterer(DecoratorScopes.Injector);
            if (decRgr.has(ctx.currDecoractor)) {
                let actions = decRgr.getFuncs(this.container, ctx.currDecoractor);
                this.execFuncs(ctx, actions, next);
            } else {
                next && next();
            }
        } else {
            next && next();
        }
    }
}

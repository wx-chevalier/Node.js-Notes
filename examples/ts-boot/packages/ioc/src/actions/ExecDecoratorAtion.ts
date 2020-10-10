import { RegisterActionContext } from './RegisterActionContext';
import { IocAction } from './Action';
import { DecoratorScopeRegisterer } from './DecoratorRegisterer';


/**
 * execute decorator action.
 *
 * @export
 * @class ExecDecoratorAtion
 * @extends {IocAction<RegisterActionContext>}
 */
export abstract class ExecDecoratorAtion extends IocAction<RegisterActionContext> {

    execute(ctx: RegisterActionContext, next?: () => void): void {
        if (ctx.currDecoractor) {
            let decor = this.getScopeRegisterer();
            if (decor.has(ctx.currDecoractor, ctx.currDecorScope)) {
                let actions = decor.getFuncs(this.container, ctx.currDecoractor, ctx.currDecorScope);
                this.execFuncs(ctx, actions, next);
            } else {
                next && next();
            }
        } else {
            next && next();
        }
    }
    protected abstract getScopeRegisterer(): DecoratorScopeRegisterer;
}


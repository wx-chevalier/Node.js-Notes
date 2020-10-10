import { IocResolveAction, ResolveActionContext, Type, IocCompositeAction, lang } from '@tsdi/ioc';
import { ParentContainerToken } from '../ContainerPoolToken';


/**
 * resolve parent action.
 *
 * @export
 * @class ResolveParentAction
 * @extends {IocResolveAction}
 */
export class ResolveParentAction extends IocResolveAction {
    execute(ctx: ResolveActionContext, next: () => void): void {
        if (ctx.actionScope) {
            let scopeType: Type<IocCompositeAction> = lang.getClass(ctx.actionScope);
            let parent = this.container.get(ParentContainerToken);
            if (parent && parent !== this.container) {
                if (parent.has(ctx.token)) {
                    ctx.instance = parent.get(ctx.token, ...ctx.providers);
                }
                if (!ctx.instance) {
                    parent.getActionRegisterer().get(scopeType).execute(ctx, next);
                }
            }
        }
    }
}

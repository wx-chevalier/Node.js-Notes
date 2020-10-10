import { ExtendsProvider, RuntimeActionContext, IocRuntimeAction } from '@tsdi/ioc';

/**
 * extends instance action.
 *
 * @export
 * @class ExetndsInstanceAction
 * @extends {IocRuntimeAction}
 */
export class ExetndsInstanceAction extends IocRuntimeAction {

    execute(ctx: RuntimeActionContext, next: () => void): void {
        // aspect class do nothing.
        if (ctx.providers && ctx.providers.length) {
            ctx.providers.forEach(p => {
                if (p && p instanceof ExtendsProvider) {
                    p.extends(ctx.target);
                }
            });
        }
        next();
    }
}

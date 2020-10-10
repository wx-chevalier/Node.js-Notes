import { RuntimeActionContext } from './RuntimeActionContext';
import { IocRuntimeAction } from './IocRuntimeAction';
import { IocCacheManager } from '../IocCacheManager';

/**
 * get class cache action.
 *
 * @export
 * @class IocGetCacheAction
 * @extends {IocCacheAction}
 */
export class IocGetCacheAction extends IocRuntimeAction {
    execute(ctx: RuntimeActionContext, next: () => void): void {
        if (!ctx.target && ctx.targetReflect.expires > 0) {
            let cacheManager = this.container.get(IocCacheManager);
            if (cacheManager.hasCache(ctx.targetType)) {
                ctx.target = cacheManager.get(ctx.target, ctx.targetReflect.expires);
                if (ctx.target) {
                    return;
                }
            }
        }
        next();
    }
}

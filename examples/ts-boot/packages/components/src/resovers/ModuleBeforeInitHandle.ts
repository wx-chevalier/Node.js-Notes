import { BuildContext } from '@tsdi/boot';
import { BeforeInit } from '../ComponentLifecycle';
import { isFunction } from '@tsdi/ioc';
import { ResolveComponentHandle } from './ResolveComponentHandle';


/**
 * module before init handle
 *
 * @export
 * @class ModuleBeforeInitHandle
 * @extends {ResolveComponentHandle}
 */
export class ModuleBeforeInitHandle extends ResolveComponentHandle {
    async execute(ctx: BuildContext, next?: () => Promise<void>): Promise<void> {
        if (!this.isComponent(ctx)) {
            return;
        }
        if (ctx.decorator) {
            let target = ctx.target as BeforeInit;
            if (target && isFunction(target.onBeforeInit)) {
                await target.onBeforeInit();
            }
        }
        if (next) {
            await next();
        }
    }
}

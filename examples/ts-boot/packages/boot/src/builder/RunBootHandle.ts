import { BootHandle } from './BootHandle';
import { BootContext } from '../BootContext';
import { StartupInit } from '../runnable';
import { isFunction } from '@tsdi/ioc';

export class RunBootHandle extends BootHandle {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        let runnable = ctx.runnable as any as StartupInit;
        if (isFunction(runnable.onInit)) {
            await runnable.onInit();
        }

        if (ctx.autorun !== false) {
            await ctx.runnable.startup(ctx);
        }

        await next();
    }
}

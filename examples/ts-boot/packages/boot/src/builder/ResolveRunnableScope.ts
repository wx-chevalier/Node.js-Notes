import { BootContext } from '../BootContext';
import { BuildHandles } from '../core';
import { Startup } from '../runnable';
import { RefRunnableHandle } from './RefRunnableHandle';


export class ResolveRunnableScope extends BuildHandles<BootContext> {
    async execute(ctx: BootContext, next: () => Promise<void>): Promise<void> {
        ctx.runnable = ctx.getBootTarget();
        if (!(ctx.runnable instanceof Startup)) {
            super.execute(ctx);
        }

        if (ctx.runnable) {
            await next();
        }
    }

    setup() {
        this.use(RefRunnableHandle);
    }
}

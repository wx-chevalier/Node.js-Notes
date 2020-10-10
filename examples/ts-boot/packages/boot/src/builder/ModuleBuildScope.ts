import { BuildHandles } from '../core';
import { BootContext } from '../BootContext';
import { ResolveBootHandle } from './ResolveBootHandle';
import { ResolveTypeHandle } from './ResolveTypeHandle';

export class ModuleBuildScope extends BuildHandles<BootContext> {

    async execute(ctx: BootContext, next?: () => Promise<void>): Promise<void> {
        // has build module instance.
        if (!ctx.target) {
            await super.execute(ctx);
        }
        if (next) {
            await next();
        }
    }

    setup() {
        this.use(ResolveTypeHandle)
            .use(ResolveBootHandle);
    }
}

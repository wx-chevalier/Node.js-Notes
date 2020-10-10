import { BuildHandles } from '../../core';
import { DecoratorBuildHandle } from './DecoratorBuildHandle';
import { ResolveModuleHandle } from './ResolveModuleHandle';
import { BuildContext } from './BuildContext';
import { InitResolveModuleHandle } from './InitResolveModuleHandle';


export class ResolveMoudleScope extends BuildHandles<BuildContext> {

    async execute(ctx: BuildContext, next?: () => Promise<void>): Promise<void> {
        // has build module instance.
        if (!ctx.target) {
            await super.execute(ctx, next);
        }
        if (next) {
            await next();
        }
    }

    setup() {

        this.use(InitResolveModuleHandle)
            .use(ResolveModuleHandle)
            .use(DecoratorBuildHandle);
    }
}

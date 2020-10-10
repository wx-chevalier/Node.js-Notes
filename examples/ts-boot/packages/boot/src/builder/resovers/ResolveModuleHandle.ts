import { BuildContext } from './BuildContext';
import { ResolveHandle } from './ResolveHandle';


export class ResolveModuleHandle extends ResolveHandle {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {
        if (!ctx.target) {
            ctx.providers = ctx.providers || [];
            ctx.argsProviders = ctx.argsProviders || [];
            ctx.target = this.resolve(ctx, ctx.type, ...[...ctx.providers, ...ctx.argsProviders]);
        }

        if (ctx.target) {
            await next();
        }
    }
}

import { BuildHandle, BuildContext } from '@tsdi/boot';

export class BindingTaskComponentHandle extends BuildHandle<BuildContext> {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {

        if (ctx.composite) {
            let target = ctx.target;
            ctx.composite.$scope = target;
            ctx.composite.isScope = true;
        }

        await next();
    }
}

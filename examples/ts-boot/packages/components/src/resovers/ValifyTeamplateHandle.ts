import { BuildContext, ResolveHandle, StartupDecoratorRegisterer, StartupScopes } from '@tsdi/boot';
import { ComponentManager } from '../ComponentManager';


export class ValifyTeamplateHandle extends ResolveHandle {
    async execute(ctx: BuildContext, next?: () => Promise<void>): Promise<void> {
        if (ctx.target && ctx.composite) {

            let mgr = this.container.get(ComponentManager);

            mgr.setAnnoation(ctx.target, ctx.annoation);
            if (ctx.scope) {
                mgr.setComposite(ctx.scope, ctx.target);
            }

            let startupRegr = this.container.get(StartupDecoratorRegisterer);

            let validRegs = startupRegr.getRegisterer(StartupScopes.ValifyComponent);
            if (validRegs.has(ctx.decorator)) {
                await this.execFuncs(ctx, validRegs.getFuncs(this.container, ctx.decorator));
            }

            if (ctx.composite) {
                mgr.setComposite(ctx.target, ctx.composite);
            }
        }

        if (next) {
            await next();
        }
    }

}

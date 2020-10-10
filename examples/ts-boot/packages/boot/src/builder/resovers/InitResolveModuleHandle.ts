import { ResolveHandle } from './ResolveHandle';
import { BuildContext } from './BuildContext';
import { ModuleDecoratorServiceToken } from '../../core';

export class InitResolveModuleHandle extends ResolveHandle {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {
        let service = this.container.get(ModuleDecoratorServiceToken);
        if (!ctx.decorator) {
            ctx.decorator = service.getDecorator(ctx.type);
        }
        if (!ctx.targetReflect) {
            let raiseContainer = ctx.getRaiseContainer();
            let reflect = raiseContainer.getTypeReflects().get(ctx.type);
            if (reflect) {
                ctx.targetReflect = reflect;
            }
        }
        if (!ctx.targetReflect.decorator) {
            ctx.targetReflect.decorator = ctx.decorator;
        }
        if (ctx.decorator) {
            if (!ctx.annoation) {
                ctx.annoation = service.getAnnoation(ctx.type, ctx.decorator);
            }
            await next();
        }
    }
}

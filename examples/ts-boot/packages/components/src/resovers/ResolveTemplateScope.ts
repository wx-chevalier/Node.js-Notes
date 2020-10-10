import { TemplateParseScope, TemplateContext } from '../parses';
import { HandleRegisterer, ResolveHandle, BuildContext } from '@tsdi/boot';
import { isNullOrUndefined } from '@tsdi/ioc';

export class ResolveTemplateScope extends ResolveHandle {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {
        if (ctx.target && ctx.annoation.template) {
            let pCtx = TemplateContext.parse({
                scope: ctx.target,
                template: ctx.annoation.template,
                annoation: ctx.annoation,
                decorator: ctx.decorator,
                raiseContainer: ctx.getContainerFactory()
            });
            await this.container.get(HandleRegisterer)
                .get(TemplateParseScope)
                .execute(pCtx);
            if (!isNullOrUndefined(pCtx.value)) {
                ctx.composite = pCtx.value;
            }
        }
        await next();
    }
}

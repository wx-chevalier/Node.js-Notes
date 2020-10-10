import { ParsersHandle } from './ParseHandle';
import { TemplateContext } from './TemplateContext';
import { isNullOrUndefined } from '@tsdi/ioc';
import { ComponentBuilderToken } from '../IComponentBuilder';


export class ParseSelectorHandle extends ParsersHandle {
    async execute(ctx: TemplateContext, next: () => Promise<void>): Promise<void> {
        if (ctx.selector) {
            let selector = ctx.selector;
            ctx.value = await this.container.resolve(ComponentBuilderToken)
                .resolve(selector, {
                    scope: ctx.scope,
                    template: ctx.template,
                    raiseContainer: ctx.getContainerFactory()
                }, ...ctx.providers);
        }
        if (isNullOrUndefined(ctx.value)) {
            await next();
        }
    }
}

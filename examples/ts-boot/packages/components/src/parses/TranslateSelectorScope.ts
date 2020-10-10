import { TemplatesHandle, TemplateHandle } from './TemplateHandle';
import { TemplateContext } from './TemplateContext';
import { StartupDecoratorRegisterer, StartupScopes } from '@tsdi/boot';

export class TranslateSelectorScope extends TemplatesHandle {
    async execute(ctx: TemplateContext, next?: () => Promise<void>): Promise<void> {
        await super.execute(ctx);
        if (next) {
            await next();
        }
    }
    setup() {
        this.use(TranslateElementHandle);
    }
}


export class TranslateElementHandle extends TemplateHandle {
    async execute(ctx: TemplateContext, next: () => Promise<void>): Promise<void> {
        let reg = ctx.getRaiseContainer().resolve(StartupDecoratorRegisterer).getRegisterer(StartupScopes.TranslateTemplate);
        if (reg.has(ctx.decorator)) {
            await this.execFuncs(ctx, reg.getFuncs(this.container, ctx.decorator));
        }

        if (!ctx.selector) {
            await next();
        }
    }
}


import { RegisterModuleRegisterHandle } from './RegisterModuleRegisterHandle';
import { AnnoationContext, BuildHandles } from '../core';
import { RegisterAnnoationHandle } from './RegisterAnnoationHandle';
import { BootContext } from '../BootContext';
import { ModuleDecoratorServiceToken } from '../core';


export class RegisterModuleScope extends BuildHandles<AnnoationContext> {

    async execute(ctx: BootContext, next?: () => Promise<void>): Promise<void> {
        if (!(ctx instanceof BootContext)) {
            return;
        }
        // has build module instance.
        if (!(this.container.has(ctx.module) && ctx.getRaiseContainer().has(ctx.module))) {
            await super.execute(ctx);
        } else {
            if (!ctx.decorator) {
                ctx.decorator = this.container.get(ModuleDecoratorServiceToken).getDecorator(ctx.module);
            }
            if (ctx.decorator) {
                if (!ctx.annoation) {
                    ctx.annoation = this.container.get(ModuleDecoratorServiceToken).getAnnoation(ctx.module, ctx.decorator);
                }
            }
        }

        if (ctx.annoation && ctx.annoation.baseURL) {
            ctx.baseURL = ctx.annoation.baseURL;
        }

        if (next) {
            await next();
        }

    }
    setup() {
        this.use(RegisterAnnoationHandle)
            .use(RegisterModuleRegisterHandle);
    }
}

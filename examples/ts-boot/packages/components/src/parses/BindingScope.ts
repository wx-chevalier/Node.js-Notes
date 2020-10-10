import { ParsersHandle, ParseHandle } from './ParseHandle';
import { BindingValueScope } from './BindingValueScope';
import { ParseContext } from './ParseContext';
import { HandleRegisterer } from '@tsdi/boot';
import { isArray, isNullOrUndefined } from '@tsdi/ioc';

/**
 * binding scope.
 *
 * @export
 * @class BindingScope
 * @extends {ParsersHandle}
 */
export class BindingScope extends ParsersHandle {

    async execute(ctx: ParseContext, next?: () => Promise<void>): Promise<void> {
        if (ctx.binding) {
            await super.execute(ctx);
        }
        if (next) {
            await next();
        }
    }

    setup() {
        this.use(BindingArrayHandle)
            .use(BindingValueScope, true)
    }
}


export class BindingArrayHandle extends ParseHandle {

    async execute(ctx: ParseContext, next: () => Promise<void>): Promise<void> {
        let registerer = this.container.get(HandleRegisterer);

        if (ctx.binding.type === Array && isArray(ctx.bindExpression)) {
            ctx.value = await Promise.all(ctx.bindExpression.map(async tp => {
                let subCtx = ParseContext.parse(ctx.type, {
                    scope: ctx.scope,
                    binding: ctx.binding,
                    bindExpression: tp,
                    template: ctx.template,
                    decorator: ctx.decorator,
                    annoation: ctx.annoation,
                    raiseContainer: ctx.getContainerFactory()
                });
                await registerer.get(BindingScope).execute(subCtx);
                return isNullOrUndefined(subCtx.value) ? tp : subCtx.value;
            }));
        }


        if (isNullOrUndefined(ctx.value)) {
            await next();
        }

    }
}

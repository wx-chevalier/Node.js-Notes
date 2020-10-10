import { ResolveHandle, BuildContext, StartupDecoratorRegisterer, StartupScopes } from '@tsdi/boot';
import { IBindingTypeReflect } from '../bindings';
import { ComponentManager } from '../ComponentManager';
import { DecoratorProvider } from '@tsdi/ioc';
import { RefSelector } from '../RefSelector';

/**
 * binding temlpate handle.
 *
 * @export
 * @class BindingTemplateHandle
 * @extends {ResolveHandle}
 */
export class BindingTemplateHandle extends ResolveHandle {
    async execute(ctx: BuildContext, next?: () => Promise<void>): Promise<void> {
        if (ctx.target && ctx.composite) {
            let ref = ctx.targetReflect as IBindingTypeReflect;
            if (ref && ref.propRefChildBindings) {
                let dpr = this.container.get(DecoratorProvider);
                if (dpr.has(ctx.decorator, RefSelector)) {
                    // todo ref chile view
                    let refSelector = dpr.resolve(ctx.decorator, RefSelector);
                    let mgr = this.container.get(ComponentManager);
                    ref.propRefChildBindings.forEach(b => {
                        mgr.getSelector(ctx.target)
                            .each((it) => {
                                let result = refSelector.select(it, b.bindingName || b.name);
                                if (result) {
                                    ctx.target[b.name] = result;
                                }
                            });
                    });
                }
            }

            let startupRegr = this.container.get(StartupDecoratorRegisterer);

            let bindRegs = startupRegr.getRegisterer(StartupScopes.Binding);
            if (bindRegs.has(ctx.decorator)) {
                await this.execFuncs(ctx, bindRegs.getFuncs(this.container, ctx.decorator));
            }

        }
        if (next) {
            await next();
        }
    }
}

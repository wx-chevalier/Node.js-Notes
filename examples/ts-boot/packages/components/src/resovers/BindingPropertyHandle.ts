import { IBindingTypeReflect, BindingTypes, DataBinding, ParseBinding } from '../bindings';
import { isNullOrUndefined, isTypeObject, isBaseValue } from '@tsdi/ioc';
import { BindingScope, ParseContext } from '../parses';
import { BuildContext, ResolveHandle, HandleRegisterer } from '@tsdi/boot';

/**
 * binding property handle.
 *
 * @export
 * @class BindingPropertyHandle
 * @extends {ResolveHandle}
 */
export class BindingPropertyHandle extends ResolveHandle {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {
        if (ctx.target) {
            let ref = ctx.targetReflect as IBindingTypeReflect;
            if (ref && ref.propInBindings) {
                let registerer = this.container.get(HandleRegisterer);
                await Promise.all(Array.from(ref.propInBindings.keys()).map(async n => {
                    let binding = ref.propInBindings.get(n);
                    let expression = ctx.template ? ctx.template[binding.bindingName || binding.name] : null;
                    if (!isNullOrUndefined(expression)) {
                        if (binding.bindingType === BindingTypes.dynamic) {
                            ctx.target[binding.name] = expression;
                        } else {
                            let pctx = ParseContext.parse(ctx.type, {
                                scope: ctx.scope,
                                bindExpression: expression,
                                template: ctx.template,
                                binding: binding,
                                annoation: ctx.annoation,
                                decorator: ctx.decorator,
                                raiseContainer: ctx.getContainerFactory()
                            })
                            await registerer.get(BindingScope).execute(pctx);

                            if (pctx.dataBinding instanceof ParseBinding) {
                                if (pctx.dataBinding.getSourceValue() === pctx.value || isBaseValue(pctx.value)) {
                                    pctx.dataBinding.bind(ctx.target);
                                } else if (isTypeObject(pctx.value)) {
                                    pctx.dataBinding.bind(pctx.value, ctx.target);
                                }
                            } else if (pctx.dataBinding instanceof DataBinding) {
                                pctx.dataBinding.bind(ctx.target);
                            } else {
                                ctx.target[binding.name] = pctx.value;
                            }
                        }
                    } else if (!isNullOrUndefined(binding.defaultValue)) {
                        ctx.target[binding.name] = binding.defaultValue;
                    }
                }));
            }
        }
        await next();
    }
}

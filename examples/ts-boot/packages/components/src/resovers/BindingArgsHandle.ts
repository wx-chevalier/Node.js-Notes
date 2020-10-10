import { BuildContext, HandleRegisterer } from '@tsdi/boot';
import { IBindingTypeReflect, BindingTypes } from '../bindings';
import { RuntimeLifeScope, isNullOrUndefined, isArray, InjectReference, lang } from '@tsdi/ioc';
import { ParseContext, BindingScope } from '../parses';
import { ResolveComponentHandle } from './ResolveComponentHandle';


export class BindingArgsHandle extends ResolveComponentHandle {
    async execute(ctx: BuildContext, next: () => Promise<void>): Promise<void> {

        if (this.isComponent(ctx)) {
            let container = ctx.getRaiseContainer();
            let providers = [];

            // let rgContianer: IContainer;
            let refs = ctx.targetReflect as IBindingTypeReflect;
            if (!refs) {
                throw new Error(`${lang.getClassName(ctx.type)} has not registered.`);
            }

            let register = container.getActionRegisterer();
            // init if not init constructor params action.
            if (!refs.methodDecors || !refs.methodParams.has('constructor')) {
                register.get(RuntimeLifeScope).getConstructorParameters(container, ctx.type);
            }

            if (refs.paramsBindings) {
                let hregisterer = this.container.get(HandleRegisterer);
                let bparams = refs.paramsBindings.get('constructor');
                if (bparams && bparams.length) {
                    await Promise.all(bparams.map(async bp => {
                        let paramVal;
                        if (!isNullOrUndefined(ctx.template)) {
                            let bindExpression = isArray(ctx.template) ? ctx.template : ctx.template[bp.bindingName || bp.name];
                            if (bp.bindingType === BindingTypes.dynamic) {
                                paramVal = bindExpression;
                            } else {
                                let pctx = ParseContext.parse(ctx.type, {
                                    scope: ctx.scope,
                                    bindExpression: bindExpression,
                                    binding: bp,
                                    template: ctx.template,
                                    annoation: ctx.annoation,
                                    decorator: ctx.decorator,
                                    raiseContainer: ctx.getContainerFactory()
                                });
                                await hregisterer.get(BindingScope).execute(pctx);
                                paramVal = pctx.value;
                            }
                        } else if (!isNullOrUndefined(bp.defaultValue)) {
                            paramVal = bp.defaultValue;
                        }
                        if (!isNullOrUndefined(paramVal)) {
                            providers.unshift({ provide: new InjectReference(bp.provider || bp.bindingName || bp.name, '__binding'), useValue: paramVal });
                        }
                    }));
                }
            }

            ctx.argsProviders = providers;
        }
        await next();

    }

}

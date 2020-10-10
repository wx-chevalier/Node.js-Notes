import { ParseHandle, ParsersHandle } from './ParseHandle';
import { ParseContext } from './ParseContext';
import { isNullOrUndefined, lang, isString, Type, isClass, isArray, isBaseType, isClassType, ClassType } from '@tsdi/ioc';
import { DataBinding, OneWayBinding, TwoWayBinding, ParseBinding } from '../bindings';
import { HandleRegisterer, BaseTypeParserToken, StartupDecoratorRegisterer, StartupScopes } from '@tsdi/boot';
import { TemplateParseScope } from './TemplateParseScope';
import { TemplateContext } from './TemplateContext';
import { SelectorManager } from '../SelectorManager';
import { ComponentBuilderToken } from '../IComponentBuilder';

/**
 * binding value scope.
 *
 * @export
 * @class BindingValueScope
 * @extends {ParsersHandle}
 */
export class BindingValueScope extends ParsersHandle {
    setup() {
        this.use(BindingScopeHandle)
            .use(TranslateExpressionHandle)
            .use(TranslateAtrrHandle)
            .use(AssignBindValueHandle)
            .use(AssignDefaultValueHandle)
    }
}


export class BindingScopeHandle extends ParseHandle {

    async execute(ctx: ParseContext, next: () => Promise<void>): Promise<void> {
        if (!ctx.dataBinding && ctx.bindExpression instanceof DataBinding) {
            ctx.dataBinding = ctx.bindExpression;
        }
        if (!ctx.dataBinding && isString(ctx.bindExpression)) {
            let regs = this.container.get(StartupDecoratorRegisterer).getRegisterer(StartupScopes.BindExpression);
            // translate binding expression via current decorator.
            if (regs.has(ctx.decorator)) {
                await this.execFuncs(ctx, regs.getFuncs(this.container, ctx.decorator));
            } else {
                let exp = ctx.bindExpression.trim();
                if (exp.startsWith('binding:')) {
                    let bindingField = ctx.bindExpression.replace('binding:', '').trim();
                    ctx.dataBinding = new OneWayBinding(this.container, ctx.scope, bindingField, ctx.binding);
                } else if (exp.startsWith('binding=:')) {
                    let bindingField = ctx.bindExpression.replace('binding=:', '').trim();
                    ctx.dataBinding = new TwoWayBinding(this.container, ctx.scope, bindingField, ctx.binding);
                }
            }
        }


        if (ctx.dataBinding instanceof ParseBinding) {
            if (!ctx.dataBinding.source) {
                ctx.dataBinding.source = ctx.scope;
            }
            ctx.bindExpression = ctx.dataBinding.getSourceValue();
        } else if (ctx.dataBinding instanceof DataBinding) {
            if (!ctx.dataBinding.source) {
                ctx.dataBinding.source = ctx.scope;
            }
            ctx.value = ctx.dataBinding.getSourceValue();
        }

        if (isNullOrUndefined(ctx.value)) {
            await next();
        }
    }
}

export class TranslateExpressionHandle extends ParseHandle {
    async execute(ctx: ParseContext, next: () => Promise<void>): Promise<void> {
        if (!isNullOrUndefined(ctx.bindExpression)) {
            let tpCtx = TemplateContext.parse({
                scope: ctx.scope,
                template: ctx.bindExpression,
                decorator: ctx.decorator,
                annoation: ctx.annoation,
                providers: ctx.providers,
                raiseContainer: ctx.getContainerFactory()
            });
            await this.container.get(HandleRegisterer)
                .get(TemplateParseScope)
                .execute(tpCtx);
            if (!isNullOrUndefined(tpCtx.value)) {
                ctx.bindExpression = tpCtx.value;
            }
        }
        if (isNullOrUndefined(ctx.value)) {
            await next();
        }
    }
}

export class TranslateAtrrHandle extends ParseHandle {
    async execute(ctx: ParseContext, next: () => Promise<void>): Promise<void> {

        if (!isNullOrUndefined(ctx.bindExpression)) {
            let mgr = this.container.get(SelectorManager);
            let pdr = ctx.binding.provider;
            let selector: ClassType;
            let template = isArray(ctx.template) ? {} : (ctx.template || {});
            template[ctx.binding.bindingName || ctx.binding.name] = ctx.bindExpression;
            if (isString(pdr) && mgr.hasAttr(pdr)) {
                selector = mgr.getAttr(pdr);
            } else if (isClassType(ctx.binding.provider) && mgr.has(ctx.binding.provider)) {
                selector = ctx.binding.provider;
            } else if (isClassType(ctx.binding.type) && mgr.has(ctx.binding.type)) {
                selector = ctx.binding.type;
            }

            if (selector) {
                let container = ctx.getRaiseContainer();
                ctx.value = await container.get(ComponentBuilderToken).resolveNode(selector, {
                    scope: ctx.scope,
                    template: template,
                    raiseContainer: ctx.getContainerFactory()
                }, ...ctx.providers);
            }

        }

        if (isNullOrUndefined(ctx.value)) {
            await next();
        }
    }
}


export class AssignBindValueHandle extends ParseHandle {
    async execute(ctx: ParseContext, next: () => Promise<void>): Promise<void> {

        if (!isNullOrUndefined(ctx.bindExpression)) {
            let type = ctx.binding.type;
            if (isBaseType(type)) {
                ctx.value = this.container.get(BaseTypeParserToken)
                    .parse(type, ctx.bindExpression);
            } else if (isClassType(type)) {
                let ttype = lang.getClass(ctx.bindExpression);
                if (lang.isExtendsClass(ttype, type)) {
                    ctx.value = ctx.bindExpression;
                }
            } else {
                ctx.value = ctx.bindExpression;
            }
        }

        if (isNullOrUndefined(ctx.value)) {
            await next();
        }
    }
}

export class AssignDefaultValueHandle extends ParseHandle {
    async execute(ctx: ParseContext, next: () => Promise<void>): Promise<void> {
        ctx.value = ctx.binding.defaultValue;

        if (isNullOrUndefined(ctx.value)) {
            await next();
        }
    }
}

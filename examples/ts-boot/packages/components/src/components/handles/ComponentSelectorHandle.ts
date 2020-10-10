import { isString, isClass, hasOwnClassMetadata, lang, Type, isMetadataObject, isArray } from '@tsdi/ioc';
import { ElementNode } from '../ElementNode';
import { TemplateHandle, TemplateContext } from '../../parses';
import { SelectorManager } from '../../SelectorManager';


export class ComponentSelectorHandle extends TemplateHandle {
    async execute(ctx: TemplateContext, next: () => Promise<void>): Promise<void> {
        if (isArray(ctx.template) && ctx.annoation.template === ctx.template) {
            ctx.selector = this.getDefaultCompose();
        } else if (this.isElement(ctx.decorator, ctx.template)) {
            ctx.selector = ctx.template;
            ctx.template = null;
        } else if (ctx.template) {
            ctx.selector = this.getComponent(ctx, ctx.template);
        }

        if (!ctx.selector) {
            await next();
        }
    }

    protected getComponent(ctx: TemplateContext, template: any): Type {
        let selector = this.getSelector(template);
        if (selector) {
            let mgr = ctx.getRaiseContainer().resolve(SelectorManager);
            if (isString(selector) && mgr.has(selector)) {
                return mgr.get(selector);
            } else if (this.isElement(ctx.decorator, selector)) {
                return selector;
            }
        }
        return null;
    }

    protected getSelector(template: any) {
        return isMetadataObject(template) ? template.element : null;
    }

    protected getDefaultCompose(): Type {
        return ElementNode;
    }

    protected isElement(decorator: string, element: any): boolean {
        return isClass(element) && (hasOwnClassMetadata(decorator, element) || lang.isExtendsClass(element, ElementNode));
    }
}

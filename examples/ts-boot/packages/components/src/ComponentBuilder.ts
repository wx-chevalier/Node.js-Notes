import { BuilderService, HandleRegisterer, IModuleResolveOption, BootTargetAccessor } from '@tsdi/boot';
import { Singleton, ProviderTypes, Type, DecoratorProvider } from '@tsdi/ioc';
import { TemplateContext, TemplateParseScope } from './parses';
import { Component } from './decorators';
import { IComponentBuilder, ComponentBuilderToken, ITemplateOption } from './IComponentBuilder';

/**
 * component builder.
 *
 * @export
 * @class ComponentBuilder
 * @extends {BuilderService}
 */
@Singleton(ComponentBuilderToken)
export class ComponentBuilder extends BuilderService implements IComponentBuilder {

    async resolveTemplate(options: ITemplateOption, ...providers: ProviderTypes[]): Promise<any> {
        let ctx = TemplateContext.parse({ ...options, providers: [...(options.providers || []), ...providers] });
        ctx.decorator = ctx.decorator || Component.toString();
        if (!ctx.hasRaiseContainer()) {
            ctx.setRaiseContainer(this.container);
        }
        await this.container.get(HandleRegisterer)
            .get(TemplateParseScope)
            .execute(ctx);
        return ctx.value;
    }


    async resolveNode<T>(target: Type<T>, options: IModuleResolveOption, ...providers: ProviderTypes[]): Promise<any> {
        let bootTarget = this.resolve(target, options, ...providers);

        let pdr = this.container.get(DecoratorProvider);
        let deckey = pdr.getKey(bootTarget);
        if (deckey && pdr.has(deckey, BootTargetAccessor)) {
            return pdr.resolve(deckey, BootTargetAccessor).getBoot(bootTarget, this.container);
        } else {
            return bootTarget;
        }

    }
}

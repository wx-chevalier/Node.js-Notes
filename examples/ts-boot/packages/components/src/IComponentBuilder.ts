import { IBuilderService, IModuleResolveOption } from '@tsdi/boot';
import { ProviderTypes, Type, InjectToken, ClassType } from '@tsdi/ioc';


export interface ITemplateOption extends IModuleResolveOption {
    selector?: Type;
}

/**
 * component build token.
 */
export const ComponentBuilderToken = new InjectToken<IComponentBuilder>('ComponentBuilder');

/**
 * component builder.
 *
 * @export
 * @interface IComponentBuilder
 * @extends {IBuilderService}
 */
export interface IComponentBuilder extends IBuilderService {
    /**
     * reolve template.
     *
     * @param {ITemplateOption} options
     * @param {...ProviderTypes[]} providers
     * @returns {Promise<any>}
     * @memberof IComponentBuilder
     */
    resolveTemplate(options: ITemplateOption, ...providers: ProviderTypes[]): Promise<any>;

    /**
     * resolve node componsite of component.
     *
     * @template T
     * @param {ClassType<T>} target
     * @param {IModuleResolveOption} options
     * @param {...ProviderTypes[]} providers
     * @returns {Promise<any>}
     * @memberof IComponentBuilder
     */
    resolveNode<T>(target: ClassType<T>, options: IModuleResolveOption, ...providers: ProviderTypes[]): Promise<any>;
}

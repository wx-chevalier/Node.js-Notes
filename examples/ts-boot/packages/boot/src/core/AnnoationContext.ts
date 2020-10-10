import { Type, ProviderMap, ActionContextOption, isClass, ContainerFactory, IocRaiseContext } from '@tsdi/ioc';
import { ModuleConfigure, RegFor, IModuleResolver } from './modules';
import { IContainer } from '@tsdi/core';

/**
 * annoation action option.
 *
 * @export
 * @interface AnnoationOption
 * @extends {ActionContextOption}
 */
export interface AnnoationOption extends ActionContextOption<IContainer> {
    /**
     * target module type.
     *
     * @type {Type}
     * @memberof AnnoationActionOption
     */
    module?: Type;
    /**
     * module decorator.
     *
     * @type {string}
     * @memberof AnnoationActionOption
     */
    decorator?: string;
}

/**
 * create annoation context.
 *
 * @export
 * @template T
 * @param {Type<T>} CtxType
 * @param {(Type | AnnoationOption)} target
 * @param {(IContainer | (() => IContainer))} [raiseContainer]
 * @returns {T}
 */
export function createAnnoationContext<T extends AnnoationContext = AnnoationContext>(CtxType: Type<T>, target: Type | AnnoationOption, raiseContainer?: IContainer | ContainerFactory<IContainer>): T {
    let type: Type;
    let options: AnnoationOption;
    if (isClass(target)) {
        type = target;
    } else {
        options = target;
        type = target.module;
    }
    let ctx = new CtxType(type);
    raiseContainer && ctx.setRaiseContainer(raiseContainer);
    options && ctx.setOptions(options);
    return ctx;
}

/**
 * annoation context.
 *
 * @export
 * @class AnnoationContext
 * @extends {HandleContext}
 */
export class AnnoationContext extends IocRaiseContext<IContainer> {

    constructor(type: Type) {
        super();
        this.module = type;
    }

    static parse(target: Type | AnnoationOption, raiseContainer?: IContainer | ContainerFactory<IContainer>): AnnoationContext {
        return createAnnoationContext(AnnoationContext, target, raiseContainer);
    }


    getRaiseContainer(): IContainer {
        return super.getRaiseContainer() as IContainer;
    }


    module: Type;

    decorator?: string;

    /**
     * annoation config.
     *
     * @type {ModuleConfigure}
     * @memberof AnnoationContext
     */
    annoation?: ModuleConfigure;

    /**
     * module type exports.
     *
     * @type {ProviderMap}
     * @memberof AnnoationContext
     */
    exports?: ProviderMap;

    /**
     * module resolver.
     *
     * @type {ModuleResovler}
     * @memberof AnnoationContext
     */
    moduleResolver?: IModuleResolver;

    /**
     * the way to register the module. default as child module.
     *
     * @type {boolean}
     * @memberof ModuleConfig
     */
    regFor?: RegFor;
}

import { ObjectMap, Type, Token } from '../../types';
import { IParameter } from '../../IParameter';
import { ITypeReflect } from '../../services';
import { ParamProviders, ProviderMap } from '../../providers';
import { ContainerFactory, IIocContainer } from '../../IIocContainer';
import { RegisterActionOption, RegisterActionContext } from '../RegisterActionContext';


/**
 * register action option.
 *
 * @export
 * @interface RegisterActionOption
 */
export interface RuntimeActionOption extends RegisterActionOption {
    /**
     * the args.
     *
     * @type {any[]}
     * @memberof RegisterActionContext
     */
    args?: any[];

    /**
     * args params types.
     *
     * @type {IParameter[]}
     * @memberof RegisterActionContext
     */
    params?: IParameter[];

    /**
     * target instance.
     *
     * @type {*}
     * @memberof RegisterActionContext
     */
    target?: any;

    /**
     * property or method name of type.
     *
     * @type {string}
     * @memberof RegisterActionContext
     */
    propertyKey?: string;

    /**
     * exter providers for resolve. origin providers
     *
     * @type {ParamProviders[]}
     * @memberof RegisterActionContext
     */
    providers?: ParamProviders[];

    /**
     * exter providers convert to map.
     *
     * @type {ProviderMap}
     * @memberof RegisterActionContext
     */
    providerMap?: ProviderMap;

    /**
     * execute context.
     *
     * @type {*}
     * @memberof RegisterActionContext
     */
    context?: any;

    /**
     * has injected.
     *
     * @type {ObjectMap<boolean>}
     * @memberof IocActionContext
     */
    injecteds?: ObjectMap<boolean>;
}

/**
 * Ioc Register action context.
 *
 * @export
 * @class RuntimeActionContext
 * @extends {RegisterActionContext}
 */
export class RuntimeActionContext extends RegisterActionContext {

    /**
     * the args.
     *
     * @type {any[]}
     * @memberof RuntimeActionContext
     */
    args?: any[];

    /**
     * args params types.
     *
     * @type {IParameter[]}
     * @memberof RuntimeActionContext
     */
    params?: IParameter[];

    /**
     * target instance.
     *
     * @type {*}
     * @memberof RuntimeActionContext
     */
    target?: any;

    /**
     * target type.
     *
     * @type {Type}
     * @memberof RuntimeActionContext
     */
    targetType?: Type;

    /**
     * resolve token.
     *
     * @type {Token}
     * @memberof RuntimeActionContext
     */
    tokenKey?: Token;

    /**
     * property or method name of type.
     *
     * @type {string}
     * @memberof RuntimeActionContext
     */
    propertyKey?: string;

    /**
     * exter providers for resolve. origin providers
     *
     * @type {ParamProviders[]}
     * @memberof RuntimeActionContext
     */
    providers?: ParamProviders[];

    /**
     * exter providers convert to map.
     *
     * @type {ProviderMap}
     * @memberof RuntimeActionContext
     */
    providerMap?: ProviderMap;

    /**
     * execute context.
     *
     * @type {*}
     * @memberof RuntimeActionContext
     */
    context?: any;

    /**
     * runtime props has injected.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RuntimeActionContext
     */
    injecteds?: ObjectMap<boolean>;

    constructor(targetType: Type) {
        super(targetType);
    }

    /**
     * create register context.
     *
     * @static
     * @param {RuntimeActionOption} options
     * @param {ContainerFactory} [raiseContainer]
     * @returns {RegisterActionContext}
     * @memberof RegisterActionContext
     */
    static parse(options: RuntimeActionOption, raiseContainer?: IIocContainer | ContainerFactory): RuntimeActionContext {
        let ctx = new RuntimeActionContext(options.targetType)
        raiseContainer && ctx.setRaiseContainer(raiseContainer);
        ctx.setOptions(options);
        return ctx;
    }

    /**
     * class decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof ITypeReflect
     */
    classDecors: ObjectMap<boolean>;

    /**
     * props decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    propsDecors: ObjectMap<boolean>;

    /**
     * method decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    methodDecors: ObjectMap<boolean>;

    /**
     * method param decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    paramDecors: ObjectMap<boolean>;

    /**
     * before constructor decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    beforeCstrDecors: ObjectMap<boolean>;

    /**
     * after constructor decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    afterCstrDecors?: ObjectMap<boolean>;


    setOptions(options: RuntimeActionOption) {
        super.setOptions(options);
    }
}

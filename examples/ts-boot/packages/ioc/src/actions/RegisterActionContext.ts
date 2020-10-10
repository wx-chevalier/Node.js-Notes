import { Type, Token } from '../types';
import { ActionContextOption } from './Action';
import { ITypeReflect } from '../services';
import { DecoratorActionContext } from './DecoratorActionContext';

/**
 * register action option.
 *
 * @export
 * @interface RegisterActionOption
 */
export interface RegisterActionOption extends ActionContextOption {
    /**
     * resolve token.
     *
     * @type {Token}
     * @memberof RegisterActionOption
     */
    tokenKey?: Token;
    /**
     * target type.
     *
     * @type {Type}
     * @memberof RegisterActionOption
     */
    targetType: Type;

    /**
     * target type reflect.
     *
     * @type {ITypeReflect}
     * @memberof RegisterActionOption
     */
    targetReflect?: ITypeReflect;

        /**
     * property or method name of type.
     *
     * @type {string}
     * @memberof RegisterActionOption
     */
    propertyKey?: string;

    /**
     * custom set singleton or not.
     *
     * @type {boolean}
     * @memberof RegisterActionOption
     */
    singleton?: boolean;

}

/**
 * Ioc Register action context.
 *
 * @export
 * @class RegisterActionContext
 * @extends {IocActionContext}
 */
export abstract class RegisterActionContext extends DecoratorActionContext {
    /**
     * resolve token.
     *
     * @type {Token}
     * @memberof RegisterActionContext
     */
    tokenKey?: Token;
    /**
     * target type.
     *
     * @type {Type}
     * @memberof RegisterActionContext
     */
    targetType?: Type;
    /**
     * target type reflect.
     *
     * @type {ITypeReflect}
     * @memberof RegisterActionContext
     */
    targetReflect?: ITypeReflect;


    constructor(targetType: Type) {
        super();
        this.targetType = targetType;
    }

    setOptions(options: RegisterActionOption) {
        super.setOptions(options);
    }

}

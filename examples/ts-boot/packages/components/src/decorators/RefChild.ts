import { isString, TypeMetadata, PropParamDecorator, createParamPropDecorator, isUndefined, isToken, isObject, Registration, ClassType, Token } from '@tsdi/ioc';
import { BindingPropertyMetadata } from './BindingPropertyMetadata';

/**
 * RefChild decorator
 *
 * @export
 * @interface IInjectableDecorator
 * @extends {IClassDecorator<IRefChildMetadata>}
 */
export interface IRefChildDecorator {
    /**
     * define RefChild property decorator with binding property name.
     *
     * @param {string} bindingName binding property name
     */
    (bindingName?: string): PropParamDecorator;

    /**
     * define RefChild property decorator with binding metadata.
     *
     * @param {string} bindingName binding property name
     */
    (metadata: BindingPropertyMetadata): PropParamDecorator;
    /**
     * define RefChild property decorator with binding property name and provider.
     *
     * @param {string} bindingName binding property name
     * @param {(Registration | ClassType)} provider define provider to resolve value to the property.
     */
    (bindingName: string, provider: Registration | ClassType): PropParamDecorator;

    /**
     * define RefChild property decorator with binding property name and provider.
     *
     * @param {string} bindingName binding property name
     * @param {*} binding default value.
     */
    (bindingName: string, defaultVal: any): PropParamDecorator;

    /**
     * define RefChild property decorator with binding property name and provider.
     *
     * @param {string} bindingName binding property name
     * @param {Token} provider define provider to resolve value to the property.
     * @param {*} binding default value.
     */
    (bindingName: string, provider: Token, defaultVal: any): PropParamDecorator;
    /**
     * define property decorator.
     */
    (target: object, propertyKey: string | symbol, parameterIndex?: number): void;
}

/**
 * RefChild decorator, define for class. use to define the class. it can setting provider to some token, singleton or not. it will execute  [`RefChildLifecycle`]
 *
 * @RefChild
 */
export const RefChild: IRefChildDecorator = createParamPropDecorator<BindingPropertyMetadata>('RefChild', args => {
    args.next<BindingPropertyMetadata>({
        match: (arg) => isString(arg),
        setMetadata: (metadata, arg) => {
            metadata.bindingName = arg;
        }
    });
    args.next<BindingPropertyMetadata>({
        match: (arg) => !isUndefined(arg),
        setMetadata: (metadata, arg) => {
            if (isToken(arg) && !isString(arg)) {
                metadata.provider = arg;
            } else {
                metadata.defaultValue = arg;
            }
        }
    });
    args.next<BindingPropertyMetadata>({
        match: (arg) => isObject(arg),
        setMetadata: (metadata, arg) => {
            metadata.defaultValue = arg;
        }
    });
});


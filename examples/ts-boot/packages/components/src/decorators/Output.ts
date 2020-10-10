import { Token, isString, PropParamDecorator, createParamPropDecorator, isToken, isObject, ClassType, Registration, isUndefined } from '@tsdi/ioc';
import { BindingPropertyMetadata } from './BindingPropertyMetadata';

/**
 * Output decorator.
 *
 * @export
 * @interface OutputPropertyDecorator
 */
export interface OutputPropertyDecorator {
    /**
     * define Output property decorator with binding property name.
     *
     * @param {string} bindingName binding property name
     */
    (bindingName?: string): PropParamDecorator;

    /**
     * define Output property decorator with binding metadata.
     *
     * @param {string} bindingName binding property name
     */
    (metadata: BindingPropertyMetadata): PropParamDecorator;
    /**
     * define Output property decorator with binding property name and provider.
     *
     * @param {string} bindingName binding property name
     * @param {(Registration | ClassType)} provider define provider to resolve value to the property.
     */
    (bindingName: string, provider: Registration | ClassType): PropParamDecorator;

    /**
     * define Output property decorator with binding property name and provider.
     *
     * @param {string} bindingName binding property name
     * @param {*} binding default value.
     */
    (bindingName: string, defaultVal: any): PropParamDecorator;

    /**
     * define Output property decorator with binding property name and provider.
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

export const Output: OutputPropertyDecorator = createParamPropDecorator<BindingPropertyMetadata>('Output', args => {
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

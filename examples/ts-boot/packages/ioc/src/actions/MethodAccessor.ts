import { Token, Type } from '../types';
import { IParameter } from '../IParameter';
import { ParamProviders, ProviderParser } from '../providers';
import { isToken, lang, isFunction, isBaseType } from '../utils';
import { IIocContainer } from '../IIocContainer';
import { RuntimeLifeScope } from './RuntimeLifeScope';

/**
 * execution, invoke some type method.
 *
 * @export
 * @interface IExecution
 */
export interface IMethodAccessor {

    /**
     * try to async invoke the method of intance, if no instance will create by type.
     *
     * @template T
     * @param {(Token<T> | T)} target
     * @param {(string | ((tag: T) => Function))} propertyKey
     * @param {...ParamProviders[]} providers
     * @returns {TR}
     * @memberof IMethodAccessor
     */
    invoke<T, TR = any>(container: IIocContainer, target: Token<T> | T, propertyKey: string | ((tag: T) => Function), ...providers: ParamProviders[]): TR;

    /**
     * create params instances with IParameter and provider
     *
     * @param {IParameter[]} params
     * @param {...AsyncParamProvider[]} providers
     * @returns {any[]}
     * @memberof IMethodAccessor
     */
    createParams(container: IIocContainer, params: IParameter[], ...providers: ParamProviders[]): any[];
}



/**
 * method accessor
 *
 * @export
 * @class MethodAccessor
 * @implements {IMethodAccessor}
 */
export class MethodAccessor implements IMethodAccessor {

    constructor() {

    }

    /**
     * try to async invoke the method of intance, if no instance will create by type.
     *
     * @template T
     * @param {IIocContainer} container
     * @param {*} target
     * @param {(string | ((tag: T) => Function))} propertyKey
     * @param {...ParamProviders[]} providers
     * @returns {T}
     * @memberof IMethodAccessor
     */
    invoke<T, TR = any>(container: IIocContainer, target: Token<T> | T, propertyKey: string | ((tag: T) => Function), ...providers: ParamProviders[]): TR {
        let targetClass: Type;
        let instance: T;
        if (isToken(target)) {
            targetClass = container.getTokenProvider(target);
            instance = container.resolve(target, ...providers);
            lang.assert(targetClass, target.toString() + ' is not implements by any class.');
        } else {
            targetClass = lang.getClass(target);
            instance = target;
        }

        let key: string;
        if (isFunction(propertyKey)) {
            let meth = propertyKey(instance);
            lang.forInClassChain(lang.getClass(instance), t => {
                let dcp = Object.getOwnPropertyDescriptors(t.prototype);
                key = Object.keys(dcp).find(k => isFunction(dcp[k].value) && !(dcp[k].set || dcp[k].get) && instance[k] === meth);
                return !key;
            });
        } else {
            key = propertyKey;
        }

        lang.assertExp(instance && isFunction(instance[key]), `type: ${targetClass} has no method ${(key || '').toString()}.`);
        let lifeScope = container.getActionRegisterer().get(RuntimeLifeScope);
        let pds = lifeScope.getParamProviders(container, targetClass, key, instance);
        providers = providers.concat(pds);
        let parameters = lifeScope.getMethodParameters(container, targetClass, instance, key);
        let paramInstances = this.createParams(container, parameters, ...providers);
        return instance[key](...paramInstances) as TR;

    }

    createParams(container: IIocContainer, params: IParameter[], ...providers: ParamProviders[]): any[] {
        let providerMap = container.get(ProviderParser).parse(...providers);
        return params.map((param, index) => {
            if (param.provider && providerMap.has(param.provider)) {
                return providerMap.resolve(param.provider);
            } else if (param.name && providerMap.has(param.name)) {
                return providerMap.resolve(param.name);
            } else if (param.provider) {
                return container.resolve(param.provider, providerMap);
            } else if (isToken(param.type)) {
                if (providerMap.has(param.type)) {
                    return providerMap.resolve(param.type);
                }
                if (isFunction(param.type) && isBaseType(param.type)) {
                    return undefined;
                }
                return container.resolve(param.type, providerMap);
            } else {
                return undefined;
            }
        });
    }
}

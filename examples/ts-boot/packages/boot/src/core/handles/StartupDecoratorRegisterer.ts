import { PromiseUtil, DecoratorScopeRegisterer } from '@tsdi/ioc';
import { IHandle } from './Handle';
import { IocBuildDecoratorRegisterer } from './IocBuildDecoratorRegisterer';

/**
 * startup build scopes.
 *
 * @export
 * @enum {number}
 */
export enum StartupScopes {
    Build = 'Build',
    /**
     * translate bind expression.
     */
    BindExpression = 'BindExpression',
    TranslateTemplate = 'TranslateTemplate',
    Binding =  'Binding',
    ValifyComponent = 'ValifyComponent'
}

/**
 * register application startup build process of decorator.
 *
 * @export
 * @class StartupDecoratorRegisterer
 * @extends {DecoratorScopeRegisterer<T, PromiseUtil.ActionHandle>}
 * @template T
 */
export class StartupDecoratorRegisterer<T extends IHandle = IHandle> extends DecoratorScopeRegisterer<T, PromiseUtil.ActionHandle> {

    protected createRegister(): IocBuildDecoratorRegisterer<T> {
        return new IocBuildDecoratorRegisterer();
    }
}

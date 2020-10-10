import { IIocContainer, IocContainerToken, ContainerFactory, ContainerFactoryToken } from '../IIocContainer';
import { Type, Token } from '../types';
import { lang, isFunction, isClass } from '../utils';
import { Inject } from '../decorators';
import { IocCoreService, ITypeReflect } from '../services';


/**
 * action context option.
 *
 * @export
 * @interface ActionContextOption
 */
export interface ActionContextOption<T extends IIocContainer = IIocContainer> {
    raiseContainer?: ContainerFactory<T>;
}

/**
 * ioc action context.
 *
 * @export
 * @class IocActionContext
 */
export class IocActionContext extends IocCoreService {

    /**
     * curr action scope
     *
     * @type {*}
     * @memberof IocActionContext
     */
    actionScope?: any;


    constructor() {
        super()
    }

    /**
     * set options.
     *
     * @param {ActionContextOption} options
     * @memberof IocActionContext
     */
    setOptions(options: ActionContextOption) {
        if (options) {
            Object.assign(this, options);
        }
    }
}


/**
 * context with raise container.
 *
 * @export
 * @class IocRasieContext
 * @extends {IocActionContext}
 */
export class IocRaiseContext<T extends IIocContainer = IIocContainer> extends IocActionContext {

    /**
     * target type reflect.
     *
     * @type {ITypeReflect}
     * @memberof IocActionContext
     */
    targetReflect?: ITypeReflect;

    @Inject(ContainerFactoryToken)
    protected raiseContainer: ContainerFactory<T>;

    /**
     * get raise container factory.
     *
     * @returns {ContainerFactory}
     * @memberof IocRasieContext
     */
    getContainerFactory(): ContainerFactory<T> {
        return this.raiseContainer;
    }
    /**
     * get raise container.
     *
     * @memberof ResovleContext
     */
    getRaiseContainer(): T {
        if (this.raiseContainer) {
            return this.raiseContainer();
        } else {
            throw new Error('has not setting raise container');
        }
    }

    hasRaiseContainer(): boolean {
        return isFunction(this.raiseContainer);
    }

    setRaiseContainer(raiseContainer: T | ContainerFactory<T>) {
        if (isFunction(raiseContainer)) {
            this.raiseContainer = raiseContainer;
        } else if (raiseContainer) {
            this.raiseContainer = raiseContainer.getFactory<T>();
        }
    }

}


/**
 * action.
 *
 * @export
 * @abstract
 * @class Action
 * @extends {IocCoreService}
 */
export abstract class IocAction<T extends IocActionContext = IocActionContext> {

    @Inject(IocContainerToken)
    protected container: IIocContainer;

    constructor(container: IIocContainer) {
        if (container) {
            this.container = container;
        }
    }

    abstract execute(ctx: T, next: () => void): void;

    protected execFuncs(ctx: T, actions: lang.IAction[], next?: () => void) {
        lang.execAction(actions, ctx, next);
    }

    private _action: lang.IAction<T>
    toAction(): lang.IAction<T> {
        if (!this._action) {
            this._action = (ctx: T, next?: () => void) => this.execute(ctx, next);
        }
        return this._action;
    }

    protected parseAction(ac: IocActionType) {
        if (isClass(ac)) {
            let action = this.container.getActionRegisterer().get(ac);
            return action instanceof IocAction ? action.toAction() : null;
        } if (ac instanceof IocAction) {
            return ac.toAction()
        }
        return isFunction(ac) ? ac : null;
    }

}

/**
 * ioc action type.
 */
export type IocActionType<T = IocAction, TAction = lang.IAction> = Token<T> | T | TAction;


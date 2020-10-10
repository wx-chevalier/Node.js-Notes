import { Task } from '../decorators/Task';
import { IContainer } from '@tsdi/core';
import { Input, ComponentManager } from '@tsdi/components';
import { ActivityContext } from './ActivityContext';
import {
    isClass, Type, hasClassMetadata, getOwnTypeMetadata, isFunction,
    Abstract, PromiseUtil, Inject, ProviderTypes, lang, isNullOrUndefined,
    ContainerFactoryToken, ContainerFactory
} from '@tsdi/ioc';
import { ActivityConfigure, ActivityType, Expression } from './ActivityConfigure';
import { ActivityResult, NextToken } from './ActivityResult';
import { ValuePipe } from './ValuePipe';
import { IActivityExecutor, ActivityExecutorToken } from './IActivityExecutor';



/**
 * activity base.
 *
 * @export
 * @abstract
 * @class ActivityBase
 * @implements {IActivity}
 * @implements {OnActivityInit}
 */
@Abstract()
export abstract class Activity<T = any, TCtx extends ActivityContext = ActivityContext> {

    /**
     * is scope or not.
     *
     * @type {boolean}
     * @memberof Activity
     */
    isScope?: boolean;

    /**
     * component of this activity.
     *
     * @type {*}
     * @memberof Activity
     */
    $scope?: any;

    private _scopes: any[];
    /**
     * components of this activity.
     *
     * @type {any[]}
     * @memberof Activity
     */
    get $scopes(): any[] {
        if (!this._scopes) {
            this._scopes = this.getContainer().get(ComponentManager).getScopes(this.$scope);
        }
        return this._scopes;
    }

    /**
     * activity display name.
     *
     * @type {string}
     * @memberof Activity
     */
    @Input() name: string;

    @Input('pipe') pipe: ValuePipe;

    private _result: ActivityResult<T>;
    /**
     * activity result.
     *
     * @type {ActivityResult<T>}
     * @memberof Activity
     */
    get result(): ActivityResult<T> {
        return this._result;
    }

    /**
     * conatiner.
     *
     * @type {IContainer}
     * @memberof Activity
     */
    @Inject(ContainerFactoryToken)
    private containerFac: ContainerFactory;


    constructor() {

    }

    getContainer(): IContainer {
        return this.containerFac() as IContainer;
    }

    /**
     * run activity.
     *
     * @abstract
     * @param {TCtx} ctx
     * @param {() => Promise<void>} next
     * @returns {Promise<void>}
     * @memberof Activity
     */
    async run(ctx: TCtx, next?: () => Promise<void>): Promise<void> {
        ctx.runnable.status.current = this;
        if (this.$scope) {
            ctx.scope = this.$scope;
        }
        this._result = await this.initResult(ctx, next);
        await this.refreshResult(ctx);
        await this.execute(ctx);
        await this.refreshContext(ctx);
        if (this.isScope) {
            ctx.runnable.status.scopeEnd();
        }
        await this.result.next(ctx);
    }


    protected abstract execute(ctx: TCtx): Promise<void>;

    protected async initResult(ctx: TCtx, next?: () => Promise<void>, ...providers: ProviderTypes[]): Promise<ActivityResult> {
        providers.unshift({ provide: NextToken, useValue: next });
        let result = this.getContainer().getService({ token: ActivityResult, target: lang.getClass(this) }, ...providers);
        if (!isNullOrUndefined(ctx.result)) {
            if (this.pipe) {
                result.value = this.pipe.transform(ctx.result);
            } else {
                result.value = ctx.result;
            }
        }
        return result;
    }

    protected async refreshResult(ctx: TCtx): Promise<any> {
        if (!isNullOrUndefined(ctx.result)) {
            if (this.pipe) {
                this.result.value = await this.pipe.transform(ctx.result);
            } else {
                this.setActivityResult(ctx);
            }
        }
    }

    protected setActivityResult(ctx: TCtx) {
        this.result.value = ctx.result;
    }

    protected async refreshContext(ctx: TCtx) {
        if (!isNullOrUndefined(this.result.value)) {
            if (this.pipe) {
                if (isFunction(this.pipe.refresh)) {
                    await this.pipe.refresh(ctx, this.result.value);
                }
            } else {
                this.setContextResult(ctx);
            }
        }
    }

    protected setContextResult(ctx: TCtx) {
        ctx.result = this.result.value;
    }

    private _executor: IActivityExecutor;
    getExector(): IActivityExecutor {
        if (!this._executor) {
            this._executor = this.getContainer().resolve(ActivityExecutorToken);
        }
        return this._executor;
    }


    protected async execActivity(ctx: TCtx, activities: ActivityType | ActivityType[], next?: () => Promise<void>, refresh?: boolean): Promise<void> {
        await this.getExector().execActivity(ctx, activities, next);
        if (refresh !== false) {
            await this.refreshResult(ctx);
        }
    }

    protected runWorkflow(ctx: TCtx, activity: ActivityType): Promise<TCtx> {
        return this.getExector().runWorkflow(ctx, activity);
    }

    private _actionFunc: PromiseUtil.ActionHandle;
    toAction(): PromiseUtil.ActionHandle<T> {
        if (!this._actionFunc) {
            this._actionFunc = (ctx: TCtx, next?: () => Promise<void>) => this.run(ctx, next);
        }
        return this._actionFunc;
    }

    /**
     * resolve expression.
     *
     * @protected
     * @template TVal
     * @param {ExpressionType<T>} express
     * @param {T} ctx
     * @returns {Promise<TVal>}
     * @memberof Activity
     */
    protected async resolveExpression<TVal>(express: Expression<TVal>, ctx: TCtx): Promise<TVal> {
        return await this.getExector().resolveExpression(ctx, express, this.getContainer());
    }

    protected promiseLikeToAction<T extends ActivityContext = ActivityContext>(action: (ctx?: T) => Promise<any>): PromiseUtil.ActionHandle<T> {
        return async (ctx: T, next?: () => Promise<void>) => {
            await action(ctx);
            if (next) {
                await next();
            }
        }
    }

}

/**
 * is acitivty instance or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Activity}
 */
export function isAcitvity(target: any): target is Activity {
    return target instanceof Activity;
}

/**
 * target is activity class.
 *
 * @export
 * @param {*} target
 * @returns {target is Type<IActivity>}
 */
export function isAcitvityClass(target: any, ext?: (meta: ActivityConfigure) => boolean): target is Type<Activity> {
    if (!isClass(target)) {
        return false;
    }
    if (hasClassMetadata(Task, target)) {
        if (ext) {
            return getOwnTypeMetadata<ActivityConfigure>(Task, target).some(meta => meta && ext(meta));
        }
        return true;
    }
    return false;
}

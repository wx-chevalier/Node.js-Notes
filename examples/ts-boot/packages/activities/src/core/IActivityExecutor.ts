import { IContainer } from '@tsdi/core';
import { ActivityContext } from './ActivityContext';
import { Expression, ActivityType } from './ActivityConfigure';
import { PromiseUtil, InjectToken } from '@tsdi/ioc';

export interface IActivityExecutor {
    /**
     * get container.
     *
     * @returns {IContainer}
     * @memberof IActivityExecutor
     */
    getContainer(): IContainer;
    /**
     * run activity in sub workflow.
     *
     * @template T
     * @param {T} ctx
     * @param {ActivityType} activities
     * @returns {Promise<void>}
     * @memberof IActivityExecutor
     */
    runWorkflow<T extends ActivityContext>(ctx: T, activities: ActivityType): Promise<T>;
    /**
     * resolve expression.
     *
     * @template TVal
     * @param {ActivityContext} ctx
     * @param {Expression<TVal>} express
     * @param {IContainer} [container]
     * @returns {Promise<TVal>}
     * @memberof IActivityExecutor
     */
    resolveExpression<TVal>(ctx: ActivityContext, express: Expression<TVal>, container?: IContainer): Promise<TVal>;
    /**
     * run activities.
     *
     * @template T
     * @param {T} ctx
     * @param {(ActivityType | ActivityType[])} activities
     * @param {() => Promise<void>} [next]
     * @returns {Promise<void>}
     * @memberof IActivityExecutor
     */
    runActivity<T extends ActivityContext>(ctx: T, activities: ActivityType | ActivityType[], next?: () => Promise<void>): Promise<void>;
    /**
     * execute activities.
     *
     * @template T
     * @param {T} ctx
     * @param {(ActivityType | ActivityType[])} activities
     * @param {() => Promise<void>} [next]
     * @returns {Promise<void>}
     * @memberof IActivityExecutor
     */
    execActivity<T extends ActivityContext>(ctx: T, activities: ActivityType | ActivityType[], next?: () => Promise<void>): Promise<void>;
    /**
     * execute actions.
     *
     * @template T
     * @param {T} ctx
     * @param {PromiseUtil.ActionHandle<T>[]} actions
     * @param {() => Promise<void>} [next]
     * @returns {Promise<void>}
     * @memberof IActivityExecutor
     */
    execActions<T extends ActivityContext>(ctx: T, actions: PromiseUtil.ActionHandle<T>[], next?: () => Promise<void>): Promise<void>;
    /**
     * parse activity to action.
     *
     * @template T
     * @param {ActivityType} activity
     * @returns {PromiseUtil.ActionHandle<T>}
     * @memberof IActivityExecutor
     */
    parseAction<T extends ActivityContext>(activity: ActivityType): PromiseUtil.ActionHandle<T>;
}

export const ActivityExecutorToken = new InjectToken<IActivityExecutor>('ActivityExecutor');

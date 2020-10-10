import { Task } from '../decorators';
import { ActivityType, ActivityContext } from '../core';
import { Input } from '@tsdi/components';
import { isArray, PromiseUtil } from '@tsdi/ioc';
import { ControlerActivity } from './ControlerActivity';

/**
 * body activity.
 *
 * @export
 * @class BodyActivity
 * @extends {ControlActivity<T>}
 * @template T
 */
@Task('[body]')
export class BodyActivity<T = any> extends ControlerActivity<T> {
    private actions: PromiseUtil.ActionHandle<ActivityContext>[];
    protected activities: ActivityType[] = [];

    constructor(@Input('body') activities: ActivityType | ActivityType[]) {
        super()
        this.activities = isArray(activities) ? activities : [activities];
    }

    protected async execute(ctx: ActivityContext): Promise<void> {
        await this.getExector().execActions(ctx, this.getActions());
    }

    protected getActions(): PromiseUtil.ActionHandle<ActivityContext>[] {
        if (!this.actions) {
            this.actions = this.activities.map(ac => this.getExector().parseAction(ac))
        }
        return this.actions;
    }

}

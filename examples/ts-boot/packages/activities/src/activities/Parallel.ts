import { Task } from '../decorators/Task';
import { ActivityContext, CompoiseActivity, ActivityType, ParallelExecutor, Activity } from '../core';
import { Input } from '@tsdi/components';



/**
 * parallel activity.
 *
 * @export
 * @class ParallelActivity
 * @extends {ControlActivity}
 */
@Task('parallel')
export class ParallelActivity<T> extends CompoiseActivity<T> {

    constructor(@Input() activities: ActivityType[]) {
        super()
        this.activities = activities || [];
    }
    /**
     * execute parallel.
     *
     * @protected
     * @returns {Promise<void>}
     * @memberof ParallelActivity
     */
    protected async execute(ctx: ActivityContext): Promise<void> {
        if (this.getContainer().has(ParallelExecutor)) {
            await this.getContainer().get(ParallelExecutor).run<ActivityType>(act => this.runWorkflow(ctx, act), this.activities)
        } else {
            await Promise.all(this.activities.map(act => this.runWorkflow(ctx, act)));
        }
    }
}

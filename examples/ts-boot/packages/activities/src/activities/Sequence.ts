import { Task } from '../decorators/Task';
import { CompoiseActivity, ActivityType } from '../core';
import { Input } from '@tsdi/components';

/**
 * sequence activity.
 *
 * @export
 * @class SequenceActivity
 * @extends {ControlActivity}
 */
@Task('sequence')
export class SequenceActivity<T> extends CompoiseActivity<T> {

    constructor(@Input() activities: ActivityType[]) {
        super()
        this.activities = activities || [];
    }

}

import { Task } from '../decorators';
import { ActivityContext } from '../core';
import { ConditionActivity } from './ConditionActivity';
import { Input } from '@tsdi/components';
import { BodyActivity } from './BodyActivity';
import { ControlerActivity } from './ControlerActivity';

/**
 * if control activity.
 *
 * @export
 * @class IfActivity
 * @extends {ControlActivity}
 */
@Task('if')
export class IfActivity<T = any> extends ControlerActivity<T> {

    @Input()
    condition: ConditionActivity;

    @Input()
    body: BodyActivity<T>;

    protected async execute(ctx: ActivityContext): Promise<void> {
        await this.tryExec(ctx);
    }

    protected async tryExec(ctx: ActivityContext) {
        await this.condition.run(ctx);
        if (this.condition.result.value) {
            await this.body.run(ctx);
        }
    }
}

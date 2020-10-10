import { Task } from '../decorators';
import { ActivityContext } from '../core';
import { ConditionActivity } from './ConditionActivity';
import { Input } from '@tsdi/components';
import { BodyActivity } from './BodyActivity';
import { ControlerActivity } from './ControlerActivity';


/**
 * while control activity.
 *
 * @export
 * @class WhileActivity
 * @extends {ControlActivity}
 */
@Task('while')
export class WhileActivity<T> extends ControlerActivity<T> {

    @Input()
    condition: ConditionActivity;

    @Input()
    body: BodyActivity<T>;

    protected async execute(ctx: ActivityContext): Promise<void> {
        await this.condition.run(ctx);
        if (this.condition.result.value) {
            await this.body.run(ctx, async () => {
                await this.condition.run(ctx);
                if (this.condition.result.value) {
                    await this.execute(ctx);
                }
            });
        }
    }
}

import { Task } from '../decorators/Task';
import { ActivityContext, Expression } from '../core';
import { Input } from '@tsdi/components';
import { ControlerActivity } from './ControlerActivity';


/**
 * throw control activity.
 *
 * @export
 * @class ThrowActivity
 * @extends {ControlActivity}
 */
@Task('[throw]')
export class ThrowActivity extends ControlerActivity<Error> {

    constructor(@Input('throw') protected error: Expression<Error>) {
        super()
    }

    protected async execute(ctx: ActivityContext): Promise<void> {
        let error = await this.resolveExpression(this.error, ctx);
        throw error;
    }
}

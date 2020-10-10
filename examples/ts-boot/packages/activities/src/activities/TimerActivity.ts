import { Task } from '../decorators';
import { Expression, ActivityContext } from '../core';
import { Input } from '@tsdi/components';
import { ControlerActivity } from './ControlerActivity';


@Task('[timer]')
export class TimerActivity extends ControlerActivity<number> {

    constructor(@Input('timer') protected time: Expression<number>) {
        super()
    }

    protected async execute(ctx: ActivityContext): Promise<void> {
        this.result.value = await this.resolveExpression(this.time, ctx);
    }
}

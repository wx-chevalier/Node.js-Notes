import { Task } from '../decorators';
import { ActivityContext, Expression } from '../core';
import { Input } from '@tsdi/components';
import { ControlerActivity } from './ControlerActivity';

/**
 * expression activity.
 *
 * @export
 * @abstract
 * @class ExpressionActivity
 * @extends {ExecuteActivity<T>}
 * @template T
 */
@Task('[expression]')
export class ExpressionActivity<T> extends ControlerActivity<T> {

    constructor(@Input() protected expression: Expression<T>) {
        super()
    }

    protected async execute(ctx: ActivityContext): Promise<void> {
        this.result.value = await this.resolveExpression(this.expression, ctx);
    }

}

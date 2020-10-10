import { Task } from '../decorators';
import { ActivityContext, Expression, Activity } from '../core';
import { Input } from '@tsdi/components';
import { Token, ProviderTypes } from '@tsdi/ioc';


/**
 * while control activity.
 *
 * @export
 * @class InvokeActivity
 * @extends {ControlActivity}
 */
@Task('invoke')
export class InvokeActivity<T = any> extends Activity<T> {

    @Input()
    target: Expression<Token>;

    @Input()
    method: Expression<string>;

    @Input()
    args: Expression<ProviderTypes[]>;

    protected async execute(ctx: ActivityContext): Promise<void> {
        let target = await this.resolveExpression(this.target, ctx);
        let method = await this.resolveExpression(this.method, ctx);
        let args = await this.resolveExpression(this.args, ctx);
        if (target && method) {
            this.result.value = this.getContainer().invoke(target, method, ...(args || []));
        }
    }
}

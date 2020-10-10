import { Task } from '../decorators';
import { ActivityContext } from '../core';
import { IfActivity } from './If';

/**
 * else if activity.
 *
 * @export
 * @class ElseIfActivity
 * @extends {IfActivity<T>}
 * @template T
 */
@Task('elseif')
export class ElseIfActivity<T = any> extends IfActivity<T> {

    protected async execute(ctx: ActivityContext): Promise<void> {
        let scope = ctx.runnable.status.currentScope;
        if (scope && scope.subs && scope.subs.length) {
            let activity = scope.subs.find(a => a !== this && a instanceof IfActivity) as IfActivity;
            if (activity && !activity.condition.result.value) {
                await this.tryExec(ctx);
            }
        }
    }
}

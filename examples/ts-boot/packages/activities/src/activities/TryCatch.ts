import { Task } from '../decorators';
import { ActivityContext, Activity } from '../core';
import { BodyActivity } from './BodyActivity';
import { Input } from '@tsdi/components';
import { lang, Type } from '@tsdi/ioc';
import { ControlerActivity } from './ControlerActivity';

@Task('catch')
export class CatchActivity<T = any> extends ControlerActivity<T> {

    @Input()
    error: Type<Error>;

    @Input()
    body: BodyActivity;

    protected async execute(ctx: ActivityContext): Promise<void> {
        let runScope = ctx.runnable.status.currentScope;
        if (this.error && runScope && runScope.scope
            && runScope.scope.result.error
            && lang.getClass(runScope.scope.result.error) === this.error) {
            this.body.run(ctx);
        } else if (!this.error) {
            this.body.run(ctx);
        }
    }
}

/**
 * while control activity.
 *
 * @export
 * @class TryCatchActivity
 * @extends {ControlActivity}
 */
@Task('try')
export class TryCatchActivity<T> extends Activity<T> {
    isScope = true;

    @Input()
    try: BodyActivity<T>;

    @Input('catchs', CatchActivity)
    catchs: CatchActivity<T>[];

    @Input()
    finallies: BodyActivity<T>;

    protected async execute(ctx: ActivityContext): Promise<void> {
        try {
            await this.try.run(ctx);
        } catch (err) {
            this.result.error = err;
            if (this.catchs) {
                await this.execActivity(ctx, this.catchs);
            }
        } finally {
            if (this.finallies) {
                await this.finallies.run(ctx);
                this.result.value = this.finallies.result.value;
            }
        }
    }
}

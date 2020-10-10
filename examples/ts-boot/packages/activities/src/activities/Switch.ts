import { Task } from '../decorators';
import { ActivityContext, Expression } from '../core';
import { BodyActivity } from './BodyActivity';
import { Input } from '@tsdi/components';
import { ControlerActivity } from './ControlerActivity';


@Task('case')
export class CaseActivity<T> extends ControlerActivity<T> {

    @Input()
    caseKey: any;

    @Input()
    body: BodyActivity<T>;

    protected async execute(ctx: ActivityContext): Promise<void> {
        this.body.run(ctx);
    }
}

/**
 * Switch control activity.
 *
 * @export
 * @class SwitchActivity
 * @extends {ControlActivity}
 */
@Task('switch')
export class SwitchActivity<T> extends ControlerActivity<T> {

    isScope = true;

    @Input()
    switch: Expression;

    @Input('cases', CaseActivity)
    cases: CaseActivity<T>[];

    @Input()
    defaults: BodyActivity<T>;

    protected async execute(ctx: ActivityContext): Promise<void> {
        let matchkey = await this.resolveExpression(this.switch, ctx);

        let activity = this.cases.find(c => c.caseKey === matchkey);

        if (activity) {
            await activity.run(ctx);
        } else if (this.defaults) {
            await this.defaults.run(ctx);
        }
    }
}

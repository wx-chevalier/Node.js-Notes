import { Task } from '../decorators';
import { ExpressionActivity } from './ExpressionActivity';
import { Input } from '@tsdi/components';
import { Expression } from '../core';

/**
 * condition activity.
 *
 * @export
 * @class ConditionActivity
 * @extends {ControlActivity<T>}
 * @template T
 */
@Task('[condition]')
export class ConditionActivity extends ExpressionActivity<boolean> {
    constructor(@Input() condition: Expression<boolean>) {
        super(condition)
    }
}

import { IContainer, ContainerToken } from '@tsdi/core';
import { Aspect, Joinpoint, Before, AfterReturning } from '@tsdi/aop';
import { RunState, ActivityContext } from '../core';
import { Task } from '../decorators/Task';
import { Inject } from '@tsdi/ioc';

/**
 * Task Log
 *
 * @export
 * @class TaskLogAspect
 */
@Aspect({
    annotation: Task,
    singleton: true
})
export class RunAspect {

    /**
     * ioc container.
     *
     * @type {IContainer}
     * @memberof RunAspect
     */
    @Inject(ContainerToken)
    container: IContainer;

    constructor() {

    }

    @Before('execution(*.execute)')
    beforeRun(joinPoint: Joinpoint) {
        let runner = this.getRunner(joinPoint.args[0]);
        if (!runner) {
            return;
        }
        runner.status.current = joinPoint.target;
    }

    @AfterReturning('execution(*.execute)')
    afterRun(joinPoint: Joinpoint) {

        let runner = this.getRunner(joinPoint.args[0]);
        if (!runner) {
            return;
        }
        switch (runner.state) {
            case RunState.pause:
                throw new Error('workflow paused!');
            case RunState.stop:
                throw new Error('workflow stop!');
        }

    }

    getRunner(ctx: ActivityContext) {
        return ctx.runnable;
    }
}

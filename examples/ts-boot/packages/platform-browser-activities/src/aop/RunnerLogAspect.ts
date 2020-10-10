import { IContainer, ContainerToken } from '@tsdi/core';
import { Around, Aspect, Joinpoint, JoinpointState } from '@tsdi/aop';
import { LoggerAspect } from '@tsdi/logs';
import {  WorkflowInstance } from '@tsdi/activities';
import { Inject, lang } from '@tsdi/ioc';
/**
 * Task Log
 *
 * @export
 * @class TaskLogAspect
 */
@Aspect({
    within: WorkflowInstance,
    singleton: true
})
export class RunnerLogAspect extends LoggerAspect {

    constructor(@Inject(ContainerToken) container: IContainer) {
        super(container);
    }

    @Around('execution(*.start)')
    logStart(joinPoint: Joinpoint) {
        let logger = this.logger;
        let runner = joinPoint.target as WorkflowInstance;
        let uuid = runner.context.id;
        let name = runner.getBoot().name || lang.getClassName(runner.context.module);
        let start: Date, end: Date;
        let taskname = '\'' + name + '\'';
        if (joinPoint.state === JoinpointState.Before) {
            start = new Date();
            runner['__startAt'] = start;
            logger.log('[' + start.toString() + ']', 'Starting workflow', taskname, '...');
        }

        if (joinPoint.state === JoinpointState.AfterReturning) {
            start = runner['__startAt'];
            end = new Date();
            delete runner['__startAt'];
            logger.log('[' + end.toString() + ']', 'Finished workflow', taskname, ' after ', end.getTime() - start.getTime());
        }

        if (joinPoint.state === JoinpointState.AfterThrowing) {
            start = runner['__startAt'];
            end = new Date();
            delete runner['__startAt'];
            logger.log('[' + end.toString() + ']', 'Finished workflow', taskname, 'errored after', end.getTime() - start.getTime());
        }
    }

}

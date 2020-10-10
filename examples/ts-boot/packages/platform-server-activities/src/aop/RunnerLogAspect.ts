import { IContainer, ContainerToken } from '@tsdi/core';
import { Around, Aspect, Joinpoint, JoinpointState } from '@tsdi/aop';
import { LoggerAspect } from '@tsdi/logs';
import chalk from 'chalk';
import { WorkflowInstance } from '@tsdi/activities';
import { Inject, lang } from '@tsdi/ioc';
const timestamp = require('time-stamp');
const prettyTime = require('pretty-hrtime');
/**
 * Task Log
 *
 * @export
 * @class TaskLogAspect
 */
@Aspect({
    // annotation: Workflow,
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
        let start, end;
        let taskname = '\'' + chalk.cyan(name || uuid) + '\'';
        if (joinPoint.state === JoinpointState.Before) {
            start = process.hrtime();
            runner['__startAt'] = start;
            logger.log('[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']', 'Starting workflow', taskname, '...');
        }

        if (joinPoint.state === JoinpointState.AfterReturning) {
            start = runner['__startAt'];
            end = prettyTime(process.hrtime(start));
            delete runner['__startAt'];
            logger.log('[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']', 'Finished workflow', taskname, ' after ', chalk.magenta(end));
        }

        if (joinPoint.state === JoinpointState.AfterThrowing) {
            start = runner['__startAt'];
            end = prettyTime(process.hrtime(start));
            delete runner['__startAt'];
            logger.log('[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']', 'Finished workflow', taskname, chalk.red('errored after'), chalk.magenta(end));
            process.exit(1);
        }
    }

}

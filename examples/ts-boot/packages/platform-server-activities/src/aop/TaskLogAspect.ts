import { IContainer, ContainerToken } from '@tsdi/core';
import { Around, Aspect, Joinpoint, JoinpointState } from '@tsdi/aop';
import { LoggerAspect } from '@tsdi/logs';
import chalk from 'chalk';
import { Task, Activity, ControlerActivity } from '@tsdi/activities';
import { Inject, lang } from '@tsdi/ioc';
const timestamp = require('time-stamp');
const prettyTime = require('pretty-hrtime');


export class ActionLogAspect extends LoggerAspect {

    constructor(@Inject(ContainerToken) container: IContainer) {
        super(container);
    }


    doLogging(joinPoint: Joinpoint) {
        (async () => {
            let logger = this.logger;
            let target = joinPoint.target as Activity;
            let name = target.name;
            if (!name && target.$scopes && target.$scopes.length) {
                name = lang.getClassName(lang.last(target.$scopes));
            }
            if (!name) {
                name = lang.getClassName(joinPoint.targetType);
            }
            let start, end;
            let taskname = '\'' + chalk.cyan(name) + '\'';
            if (joinPoint.state === JoinpointState.Before) {
                start = process.hrtime();
                target['__startAt'] = start;
                logger.log('[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']', 'Starting', taskname, '...');
            }

            if (joinPoint.state === JoinpointState.AfterReturning) {
                start = target['__startAt'];
                end = prettyTime(process.hrtime(start));
                delete target['__startAt'];
                logger.log('[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']', 'Finished', taskname, ' after ', chalk.magenta(end));
            }

            if (joinPoint.state === JoinpointState.AfterThrowing) {
                start = target['__startAt'];
                end = prettyTime(process.hrtime(start));
                delete target['__startAt'];
                logger.log('[' + chalk.grey(timestamp('HH:mm:ss', new Date())) + ']', 'Finished', taskname, chalk.red('errored after'), chalk.magenta(end));
                process.exit(1);
            }
        })();
    }
}

/**
 *  Custome Task Log
 *
 * @export
 * @class TaskLogAspect
 */
@Aspect({
    annotation: Task,
    within: Activity,
    without: ControlerActivity,
    singleton: true
})
export class TaskLogAspect extends ActionLogAspect {

    @Around('execution(*.execute)')
    Logging(joinPoint: Joinpoint) {
        this.doLogging(joinPoint);
    }
}


/**
 * control flow log
 *
 * @export
 * @class TaskControlLogAspect
 * @extends {ActionLogAspect}
 */
@Aspect({
    annotation: Task,
    within: ControlerActivity,
    singleton: true
})
export class TaskControlLogAspect extends ActionLogAspect {
    @Around('execution(*.execute)')
    Logging(joinPoint: Joinpoint) {
        this.doLogging(joinPoint);
    }
}

import { Inject, lang } from '@tsdi/ioc';
import { IContainer, ContainerToken } from '@tsdi/core';
import { Around, Aspect, Joinpoint, JoinpointState } from '@tsdi/aop';
import { LoggerAspect } from '@tsdi/logs';
import { Task, Activity, ControlerActivity } from '@tsdi/activities';

/**
 * Task Log
 *
 * @export
 * @class TaskLogAspect
 */
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
            let start: Date, end: Date;
            let taskname = '\'' + name + '\'';
            if (joinPoint.state === JoinpointState.Before) {
                start = new Date();
                target['__startAt'] = start;
                logger.log('[' + start.toString() + ']', 'Starting', taskname, '...');
            }

            if (joinPoint.state === JoinpointState.AfterReturning) {
                start = target['__startAt'];
                end = new Date();
                delete target['__startAt'];
                logger.log('[' + end.toString() + ']', 'Finished', taskname, ' after ', end.getTime() - start.getTime());
            }

            if (joinPoint.state === JoinpointState.AfterThrowing) {
                start = target['__startAt'];
                end = new Date();
                delete target['__startAt'];
                logger.log('[' + end.toString() + ']', 'Finished', taskname, 'errored after', end.getTime() - start.getTime());
            }
        })();
    }
}

/**
 * custom task log
 *
 * @export
 * @class TaskLogAspect
 * @extends {ActionLogAspect}
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

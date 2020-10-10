import { AdvisorToken } from '../IAdvisor';
import { AdviceMatcherToken } from '../IAdviceMatcher';
import { Advices, Advicer } from '../advices';
import { isValideAspectTarget } from '../isValideAspectTarget';
import { RuntimeActionContext, IocRuntimeAction } from '@tsdi/ioc';

/**
 *  match pointcut action.
 *
 * @export
 * @class MatchPointcutAction
 * @extends {IocRuntimeAction}
 */
export class MatchPointcutAction extends IocRuntimeAction {

    execute(ctx: RuntimeActionContext, next: () => void): void {
        // aspect class do nothing.
        if (!isValideAspectTarget(ctx.targetType)) {
            return next();
        }

        let advisor = this.container.get(AdvisorToken);
        let matcher = this.container.get(AdviceMatcherToken);
        advisor.aspects.forEach((adviceMetas, type) => {
            let matchpoints = matcher.match(type, ctx.targetType, adviceMetas, ctx.target);
            matchpoints.forEach(mpt => {
                let fullName = mpt.fullName;
                let advice = mpt.advice;

                let advices = advisor.getAdvices(fullName);
                if (!advices) {
                    advices = {
                        Before: [],
                        Pointcut: [],
                        After: [],
                        Around: [],
                        AfterThrowing: [],
                        AfterReturning: []
                    } as Advices;
                    advisor.setAdvices(fullName, advices);
                }
                let advicer = Object.assign(mpt, {
                    aspectType: type
                }) as Advicer;

                if (advice.adviceName === 'Before') {
                    if (!advices.Before.some(a => this.equals(a, advicer))) {
                        advices.Before.push(advicer);
                    }
                } else if (advice.adviceName === 'Pointcut') {
                    if (!advices.Pointcut.some(a => this.equals(a, advicer))) {
                        advices.Pointcut.push(advicer);
                    }
                } else if (advice.adviceName === 'Around') {
                    if (!advices.Around.some(a => this.equals(a, advicer))) {
                        advices.Around.push(advicer);
                    }
                } else if (advice.adviceName === 'After') {
                    if (!advices.After.some(a => this.equals(a, advicer))) {
                        advices.After.push(advicer);
                    }
                } else if (advice.adviceName === 'AfterThrowing') {
                    if (!advices.AfterThrowing.some(a => this.equals(a, advicer))) {
                        advices.AfterThrowing.push(advicer);
                    }
                } else if (advice.adviceName === 'AfterReturning') {
                    if (!advices.AfterReturning.some(a => this.equals(a, advicer))) {
                        advices.AfterReturning.push(advicer);
                    }
                }
            });
        });
        next();
    }

    protected equals(a: Advicer, b: Advicer) {
        return a.aspectType === b.aspectType && a.advice.propertyKey === b.advice.propertyKey;
    }
}

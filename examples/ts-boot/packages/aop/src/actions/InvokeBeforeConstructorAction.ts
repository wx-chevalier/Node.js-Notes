import { AdvisorToken } from '../IAdvisor';
import { Joinpoint, JoinpointState, JoinpointOptionToken } from '../joinpoints';
import { isValideAspectTarget } from '../isValideAspectTarget';
import { ParamProviders, lang, RuntimeActionContext, IocRuntimeAction } from '@tsdi/ioc';

/**
 * actions invoke before constructor.
 *
 * @export
 * @class InvokeBeforeConstructorAction
 * @extends {IocRuntimeAction}
 */
export class InvokeBeforeConstructorAction extends IocRuntimeAction {

    execute(ctx: RuntimeActionContext, next: () => void): void {
        // aspect class do nothing.
        if (!isValideAspectTarget(ctx.targetType)) {
            return next();
        }

        let advisor = this.container.get(AdvisorToken);
        let className = lang.getClassName(ctx.targetType);
        let advices = advisor.getAdvices(className + '.constructor');
        if (!advices) {
            return next();
        }

        let targetType = ctx.targetType;
        let target = ctx.target;

        let joinPoint = this.container.get(Joinpoint, {
            provide: JoinpointOptionToken,
            useValue: {
                name: 'constructor',
                state: JoinpointState.Before,
                fullName: className + '.constructor',
                target: target,
                args: ctx.args,
                params: ctx.params,
                targetType: targetType
            }
        });
        let providers: ParamProviders[] = [{ provide: Joinpoint, useValue: joinPoint }];

        if (ctx.providerMap) {
            providers.push(ctx.providerMap);
        }

        advices.Before.forEach(advicer => {
            advisor.getContainer(advicer.aspectType, this.container).invoke(advicer.aspectType, advicer.advice.propertyKey, ...providers);
        });

        advices.Pointcut.forEach(advicer => {
            advisor.getContainer(advicer.aspectType, this.container).invoke(advicer.aspectType, advicer.advice.propertyKey, ...providers);
        });

        advices.Around.forEach(advicer => {
            advisor.getContainer(advicer.aspectType, this.container).invoke(advicer.aspectType, advicer.advice.propertyKey, ...providers);
        });

        next();

    }
}

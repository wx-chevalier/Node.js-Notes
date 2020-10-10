import {
    Singleton, Inject, Type, isFunction, RuntimeLifeScope,
    ObjectMapProvider, IocContainerToken, IIocContainer, MetadataService
} from '@tsdi/ioc';
import { Advices } from '../advices';
import { JoinpointState, IPointcut, JoinpointOptionToken, Joinpoint } from '../joinpoints';
import { IAdvisor, AdvisorToken } from '../IAdvisor';
import { IProxyMethod, ProxyMethodToken } from './IProxyMethod';
import { NonePointcut } from '../decorators/NonePointcut';
import { AdvisorChainFactory } from './AdvisorChainFactory';

/**
 * Proxy method.
 *
 * @export
 * @class ProxyMethod
 * @implements {IProxyMethod}
 */
@NonePointcut()
@Singleton(ProxyMethodToken)
export class ProxyMethod implements IProxyMethod {

    constructor(@Inject(IocContainerToken) private container: IIocContainer) {

    }

    private _advisor: IAdvisor;
    get advisor(): IAdvisor {
        if (!this._advisor) {
            this._advisor = this.container.get(AdvisorToken);
        }
        return this._advisor;
    }

    private _lifeScope: RuntimeLifeScope;
    get lifeScope(): RuntimeLifeScope {
        if (!this._lifeScope) {
            this._lifeScope = this.container.getActionRegisterer().get(RuntimeLifeScope);
        }
        return this._lifeScope;
    }

    /**
     * proceed the proxy method.
     *
     * @param {*} target
     * @param {Type} targetType
     * @param {IPointcut} pointcut
     * @param {Joinpoint} [provJoinpoint]
     * @memberof ProxyMethod
     */
    proceed(target: any, targetType: Type, pointcut: IPointcut, provJoinpoint?: Joinpoint) {

        let aspectMgr = this.advisor;
        let fullName = pointcut.fullName;
        let methodName = pointcut.name;

        let advices = aspectMgr.getAdvices(fullName);
        if (advices && pointcut) {
            if (pointcut.descriptor && (pointcut.descriptor.get || pointcut.descriptor.set)) {
                if (pointcut.descriptor.get) {
                    let getMethod = pointcut.descriptor.get.bind(target);
                    pointcut.descriptor.get = this.proxy(getMethod, advices, target, targetType, pointcut, provJoinpoint);
                }
                if (pointcut.descriptor.set) {
                    let setMethod = pointcut.descriptor.set.bind(target);
                    pointcut.descriptor.set = this.proxy(setMethod, advices, target, targetType, pointcut, provJoinpoint);
                }
                Reflect.defineProperty(target, methodName, pointcut.descriptor);
            } else if (isFunction(target[methodName])) {
                let propertyMethod = target[methodName].bind(target);
                target[methodName] = this.proxy(propertyMethod, advices, target, targetType, pointcut, provJoinpoint);
            }
        }
    }

    proxy(propertyMethod: Function, advices: Advices, target: any, targetType: Type, pointcut: IPointcut, provJoinpoint?: Joinpoint) {
        let fullName = pointcut.fullName;
        let methodName = pointcut.name;
        let container = this.container;
        let lifeScope = this.lifeScope;
        return (...args: any[]) => {
            let joinPoint = this.container.get(Joinpoint, {
                provide: JoinpointOptionToken,
                useValue: {
                    name: methodName,
                    fullName: fullName,
                    provJoinpoint: provJoinpoint,
                    annotations: provJoinpoint ? null : this.container.get(MetadataService).getMethodMetadatas(targetType, methodName),
                    params: lifeScope.getMethodParameters(this.container, targetType, target, methodName),
                    args: args,
                    target: target,
                    targetType: targetType
                }
            });

            let adChain = container.get(AdvisorChainFactory, { provide: IocContainerToken, useValue: container }, { provide: AdvisorToken, useValue: this.advisor }, ObjectMapProvider.parse({ container: container, advisor: this.advisor, advices: advices }));

            let val, exeErr;
            try {
                adChain.invoaction(joinPoint, JoinpointState.Before);
                adChain.invoaction(joinPoint, JoinpointState.Pointcut);
                val = propertyMethod(...joinPoint.args);
            } catch (err) {
                exeErr = err;
                adChain.invoaction(joinPoint, JoinpointState.AfterThrowing, exeErr);
                throw exeErr;
            }
            (async () => {
                adChain.invoaction(joinPoint, JoinpointState.After, val);
            })();
            if (!exeErr) {
                adChain.invoaction(joinPoint, JoinpointState.AfterReturning, val);
                return joinPoint.returning;
            }
        }
    }
}

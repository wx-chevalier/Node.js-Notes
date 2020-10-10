import { Type, InjectToken } from '@tsdi/ioc';
import { IPointcut, Joinpoint } from '../joinpoints';

/**
 * Aop proxy method interface token.
 * it is a token id, you can register yourself IProxyMethod for this.
 */
export const ProxyMethodToken = new InjectToken<IProxyMethod>('DI_IProxyMethod');

/**
 * proxy method, for proxy advice method.
 *
 * @export
 * @interface IProxyMethod
 */
export interface IProxyMethod {
    /**
     * proceed the proxy method.
     *
     * @param {*} target
     * @param {Type} targetType
     * @param {IPointcut} pointcut
     * @param {Joinpoint} [provJoinpoint]
     * @memberof IProxyMethod
     */
    proceed(target: any, targetType: Type, pointcut: IPointcut, provJoinpoint?: Joinpoint);
}

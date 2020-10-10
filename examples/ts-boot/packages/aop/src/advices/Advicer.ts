import { Type } from '@tsdi/ioc';
import { MatchPointcut } from '../joinpoints/MatchPointcut';
/**
 * AdviceInvokerData
 *
 * @export
 * @interface Advicer
 */
export interface Advicer extends MatchPointcut {
    /**
     * aspect type.
     *
     * @type {Type}
     * @memberof Advicer
     */
    aspectType: Type;

}


import { Advicer } from './Advicer';

/**
 * advices of target.
 *
 * @export
 * @interface Advices
 */
export interface Advices {
    Pointcut: Advicer[];
    Before: Advicer[];
    After: Advicer[];
    Around: Advicer[];
    AfterThrowing: Advicer[];
    AfterReturning: Advicer[];
}

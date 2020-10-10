import { Joinpoint } from '../joinpoints';
import { Express } from '@tsdi/ioc';


/**
 * advisor proceeding.
 *
 * @export
 * @interface IAdvisorProceeding
 */
export abstract class AdvisorProceeding {
    constructor() {
    }

    /**
     * process.
     *
     * @param {Joinpoint} joinPoint
     * @param {...Express<Joinpoint, any>[]} actions
     * @memberof IAdvisorProceeding
     */
    abstract proceeding(joinPoint: Joinpoint, ...actions: Express<Joinpoint, any>[]): void;
}

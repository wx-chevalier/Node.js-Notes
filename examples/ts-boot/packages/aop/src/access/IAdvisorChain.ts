import { Joinpoint } from '../joinpoints';
import { Express, InjectToken } from '@tsdi/ioc';
import { IocRecognizer } from './IocRecognizer';

/**
 * Aop IAdvisorChain interface token.
 * it is a token id, you can register yourself IAdvisorChain for this.
 */
export const AdvisorChainToken = new InjectToken<IAdvisorChain>('DI_IAdvisorChain');

/**
 * advisor chain.
 *
 * @export
 * @interface IAdvisorChain
 */
export interface IAdvisorChain {
    /**
     * register next step of chain.
     *
     * @param {Express<Joinpoint, any>} action
     * @memberof IAdvisorChain
     */
    next(action: Express<Joinpoint, any>);
    /**
     * get Recognizer of the chain, to recognize the vaule is special alias for registor to container.
     *
     * @returns {IocRecognizer}
     * @memberof IAdvisorChain
     */
    getRecognizer(): IocRecognizer;
    /**
     * run chain process.
     *
     * @memberof IAdvisorChain
     */
    process(): void;
}

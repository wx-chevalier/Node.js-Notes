import { Injectable, Inject, Express, IocContainerToken, IIocContainer } from '@tsdi/ioc';
import { Joinpoint } from '../joinpoints';
import { IAdvisorChain, AdvisorChainToken } from './IAdvisorChain';
import { AdvisorProceeding } from './AdvisorProceeding';
import { NonePointcut } from '../decorators/NonePointcut';
import { IocRecognizer } from './IocRecognizer';

/**
 * advisor chain.
 *
 * @export
 * @class AdvisorChain
 * @implements {IAdvisorChain}
 */
@NonePointcut()
@Injectable(AdvisorChainToken)
export class AdvisorChain implements IAdvisorChain {

    @Inject(IocContainerToken)
    container: IIocContainer;

    protected actions: Express<Joinpoint, any>[];

    constructor(protected joinPoint: Joinpoint) {
        this.actions = [];
    }

    /**
     * register next action.
     *
     * @param {Express<Joinpoint, any>} action
     * @memberof AdvisorChain
     */
    next(action: Express<Joinpoint, any>) {
        this.actions.push(action);
    }

    /**
     * get recognizer of this advisor.
     *
     * @returns {IRecognizer}
     * @memberof AdvisorChain
     */
    getRecognizer(): IocRecognizer {
        return this.container.get(IocRecognizer, this.joinPoint.state);
    }

    /**
     * process the advices.
     *
     * @memberof AdvisorChain
     */
    process(): void {
        let alias = this.getRecognizer().recognize(this.joinPoint.returning);
        this.container
            .get(AdvisorProceeding, alias)
            .proceeding(this.joinPoint, ...this.actions);
    }

}

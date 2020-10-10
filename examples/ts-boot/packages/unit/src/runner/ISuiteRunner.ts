import { InjectStartupToken, IStartup, IRunnable } from '@tsdi/boot';
import { ISuiteDescribe, ICaseDescribe } from '../reports/ITestReport';


/**
 * suite runner token.
 */
export const SuiteRunnerToken = new InjectStartupToken<ISuiteRunner>('@Suite');

/**
 * suite runner interface.
 *
 * @export
 * @interface ISuiteRunner
 * @extends {IRunner<any>}
 */
export interface ISuiteRunner extends IRunnable {

    /**
     * run suite.
     *
     * @param {ISuiteDescribe} desc
     * @returns {Promise<void>}
     * @memberof ISuiteRunner
     */
    runSuite(desc: ISuiteDescribe): Promise<void>;

    /**
     * run case.
     *
     * @param {ICaseDescribe} caseDesc
     * @returns {Promise<ICaseDescribe>}
     * @memberof ISuiteRunner
     */
    runCase(caseDesc: ICaseDescribe): Promise<ICaseDescribe>;
}

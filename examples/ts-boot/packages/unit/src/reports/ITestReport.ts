import { Token } from '@tsdi/ioc';


/**
 * test case.
 *
 * @export
 * @interface ITestCase
 */
export interface ICaseDescribe {
    /**
     * case title.
     *
     * @type {string}
     * @memberof ICaseDescribe
     */
    title: string;
    /**
     * test case method name.
     *
     * @type {string}
     * @memberof ICaseDescribe
     */
    key: string;
    /**
     * old test fn.
     *
     * @type {Function}
     * @memberof ICaseDescribe
     */
    fn?: Function;
    /**
     * case order
     *
     * @type {number}
     * @memberof ICaseDescribe
     */
    order?: number;
    /**
     * case test time out.
     *
     * @type {number}
     * @memberof ICaseDescribe
     */
    timeout?: number;
    /**
     * case test throwed error.
     *
     * @type {Error}
     * @memberof ICaseDescribe
     */
    error?: Error;
    /**
     * case start test at.
     *
     * @type {number}
     * @memberof ICaseDescribe
     */
    start?: number;
    /**
     * case end test at.
     *
     * @type {number}
     * @memberof ICaseDescribe
     */
    end?: number;
}

/**
 * suite hook for old unit test.
 *
 * @export
 * @interface ISuiteHook
 */
export interface ISuiteHook {
    fn: Function;
    /**
     * case test time out.
     *
     * @type {number}
     * @memberof ICaseDescribe
     */
    timeout?: number;
}

/**
 * suite.
 *
 * @export
 * @interface ISuite
 */
export interface ISuiteDescribe {
    /**
     * suite describe.
     *
     * @type {string}
     * @memberof ISuiteDescribe
     */
    describe: string;
    /**
     * suite cases.
     *
     * @type {ICaseDescribe[]}
     * @memberof ISuiteDescribe
     */
    cases: ICaseDescribe[];
    /**
     * suite test timeout.
     *
     * @type {number}
     * @memberof ISuiteDescribe
     */
    timeout?: number;
    /**
     * suite test start time.
     *
     * @type {number}
     * @memberof ISuiteDescribe
     */
    start?: number;
    /**
     * suite test end time.
     *
     * @type {number}
     * @memberof ISuiteDescribe
     */
    end?: number;

    /**
     * suite before hook for old unit test.
     *
     * @type {ISuiteHook[]}
     * @memberof ISuiteDescribe
     */
    before?: ISuiteHook[];
    /**
     * suite beforeEach hook for old unit test.
     *
     * @type {ISuiteHook[]}
     * @memberof ISuiteDescribe
     */
    beforeEach?: ISuiteHook[];
    /**
     * suite after hook for old unit test.
     *
     * @type {ISuiteHook[]}
     * @memberof ISuiteDescribe
     */
    after?: ISuiteHook[];
    /**
     * suite afterEach hook for old unit test.
     *
     * @type {ISuiteHook[]}
     * @memberof ISuiteDescribe
     */
    afterEach?: ISuiteHook[];
}

/**
 * report
 *
 * @export
 * @interface ITestReport
 */
export interface ITestReport {
    /**
     * suites.
     *
     * @type {Map<Token, ISuiteDescribe>}
     * @memberof ITestReport
     */
    suites: Map<Token, ISuiteDescribe>;
    /**
     * add suite.
     *
     * @param {Token} suit
     * @param {ISuiteDescribe} describe
     * @memberof ITestReport
     */
    addSuite(suit: Token, describe: ISuiteDescribe);
    /**
     * get suite.
     *
     * @param {Token} suit
     * @returns {ISuiteDescribe}
     * @memberof ITestReport
     */
    getSuite(suit: Token): ISuiteDescribe;
    /**
     * set suite completed.
     *
     * @param {Token} suit
     * @memberof ITestReport
     */
    setSuiteCompleted(suit: Token);
    /**
     * add case.
     *
     * @param {Token} suit
     * @param {ICaseDescribe} testCase
     * @memberof ITestReport
     */
    addCase(suit: Token, testCase: ICaseDescribe);
    /**
     * get case.
     *
     * @param {Token} suit
     * @param {string} test
     * @returns {ICaseDescribe}
     * @memberof ITestReport
     */
    getCase(suit: Token, test: string): ICaseDescribe;
    /**
     * set case completed.
     *
     * @param {ICaseDescribe} testCase
     * @memberof ITestReport
     */
    setCaseCompleted(testCase: ICaseDescribe);
    /**
     * report.
     *
     * @returns {Promise<void>}
     * @memberof ITestReport
     */
    report(): Promise<void>;
}

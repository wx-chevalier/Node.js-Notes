import { Inject, PromiseUtil, Singleton, Type } from '@tsdi/ioc';
import { ISuiteRunner } from './ISuiteRunner';
import { ISuiteDescribe, ICaseDescribe } from '../reports';
import { Assert } from '../assert';
import { ContainerToken, IContainer } from '@tsdi/core';
import { BootContext } from '@tsdi/boot';

declare let window: any;
declare let global: any;

let gls = {
    describe: undefined,
    suite: undefined,
    it: undefined,
    test: undefined,
    before: undefined,
    beforeEach: undefined,
    after: undefined,
    afterEach: undefined
};

let globals = typeof window !== 'undefined' ? window : global;

/**
 * Suite runner.
 *
 * @export
 * @class SuiteRunner
 * @implements {IRunner<any>}
 */
@Singleton
export class OldTestRunner implements ISuiteRunner {

    @Inject(ContainerToken)
    private container: IContainer;

    getContainer(): IContainer {
        return this.container;
    }

    timeout: number;
    describe: string;

    suites: Map<string, ISuiteDescribe>;

    getBootType(): Type {
        return null;
    }


    getBoot() {
        return this.suites;
    }

    constructor(timeout?: number) {
        this.suites = new Map();
        this.timeout = timeout || (3 * 60 * 60 * 1000);
    }

    async onInit(): Promise<void> {

    }


    registerGlobalScope() {
        // isUndefined(window) ? global : window;
        Object.keys(gls).forEach(k => {
            gls[k] = globals[k];
        });

        // BDD style
        let describe = globals.describe = (name: string, fn: () => any) => {
            let suiteDesc = {
                describe: name,
                cases: []
            } as ISuiteDescribe;

            globals.describe = (subname: string, fn: () => any) => {
                describe(name + ' ' + subname, fn);
            }

            globals.it = (title: string, test: () => any, timeout?: number) => {
                suiteDesc.cases.push({ title: title, key: '', fn: test, timeout: timeout })
            }
            globals.before = (test: () => any, timeout?: number) => {
                suiteDesc.before = suiteDesc.before || [];
                suiteDesc.before.push({
                    fn: test,
                    timeout: timeout
                })
            }
            globals.beforeEach = (test: () => any, timeout?: number) => {
                suiteDesc.beforeEach = suiteDesc.beforeEach || [];
                suiteDesc.beforeEach.push({
                    fn: test,
                    timeout: timeout
                });
            }
            globals.after = (test: () => any, timeout?: number) => {
                suiteDesc.after = suiteDesc.after || [];
                suiteDesc.after.push({
                    fn: test,
                    timeout: timeout
                });
            }
            globals.afterEach = (test: () => any, timeout?: number) => {
                suiteDesc.afterEach = suiteDesc.afterEach || [];
                suiteDesc.afterEach.push({
                    fn: test,
                    timeout: timeout
                });
            }
            fn && fn();
            if (suiteDesc.cases.length) {
                this.suites.set(name, suiteDesc);
            }
            globals.describe = describe;
        };

        // TDD style
        let suite = globals.suite = (name: string, fn: () => any) => {
            let suiteDesc = {
                describe: name,
                cases: []
            } as ISuiteDescribe;
            globals.suite = (subname: string, fn: () => any) => {
                suite(name + ' ' + subname, fn);
            }
            globals.test = (title: string, test: () => any, timeout?: number) => {
                suiteDesc.cases.push({ title: title, key: '', fn: test, timeout: timeout })
            }
            globals.before = (test: () => any, timeout?: number) => {
                suiteDesc.before = suiteDesc.before || [];
                suiteDesc.before.push({
                    fn: test,
                    timeout: timeout
                })
            }
            globals.beforeEach = (test: () => any, timeout?: number) => {
                suiteDesc.beforeEach = suiteDesc.beforeEach || [];
                suiteDesc.beforeEach.push({
                    fn: test,
                    timeout: timeout
                });
            }
            globals.after = (test: () => any, timeout?: number) => {
                suiteDesc.after = suiteDesc.after || [];
                suiteDesc.after.push({
                    fn: test,
                    timeout: timeout
                });
            }
            globals.afterEach = (test: () => any, timeout?: number) => {
                suiteDesc.afterEach = suiteDesc.afterEach || [];
                suiteDesc.afterEach.push({
                    fn: test,
                    timeout: timeout
                });
            }
            fn && fn();
            if (suiteDesc.cases.length) {
                this.suites.set(name, suiteDesc);
            }
            globals.suite = suite;
        };
    }

    unregisterGlobalScope() {
        // reset to default.
        Object.keys(gls).forEach(k => {
            globals[k] = gls[k];
        })

    }

    async startup(ctx: BootContext) {
        return this.run(ctx.data);
    }

    async run(data?: any): Promise<any> {
        try {
            await PromiseUtil.step(Array.from(this.suites.values()).map(desc => () => this.runSuite(desc)));
        } catch (err) {
            // console.error(err);
        }
    }

    async runSuite(desc: ISuiteDescribe): Promise<void> {
        await this.runBefore(desc);
        await this.runTest(desc);
        await this.runAfter(desc);
    }

    runTimeout(fn: Function, describe: string, timeout: number): Promise<any> {
        let defer = PromiseUtil.defer();
        let timer = setTimeout(() => {
            if (timer) {
                clearTimeout(timer);
                let assert = this.getContainer().resolve(Assert);
                let err = new assert.AssertionError({
                    message: `${describe}, timeout ${timeout}`,
                    stackStartFunction: fn,
                    stackStartFn: fn
                });
                defer.reject(err);
            }
        }, timeout || this.timeout);

        Promise.resolve(fn(() => defer.resolve()))
            .then(r => {
                clearTimeout(timer);
                timer = null;
                defer.resolve(r);
            })
            .catch(err => {
                clearTimeout(timer);
                timer = null;
                defer.reject(err);
            })

        return defer.promise;
    }

    async runHook(describe: ISuiteDescribe, action: string, desc: string) {
        await PromiseUtil.step(
            (describe[action] || [])
                .map(hk => () => this.runTimeout(
                    hk.fn,
                    desc,
                    hk.timeout || describe.timeout)));
    }

    async runBefore(describe: ISuiteDescribe) {
        await this.runHook(describe, 'before', 'suite before');
    }

    async runBeforeEach(describe: ISuiteDescribe) {
        await this.runHook(describe, 'beforeEach', 'before each');
    }

    async runAfterEach(describe: ISuiteDescribe) {
        await this.runHook(describe, 'afterEach', 'after case each');
    }

    async runAfter(describe: ISuiteDescribe) {
        await this.runHook(describe, 'after', 'suite after');
    }

    async runTest(desc: ISuiteDescribe) {
        await PromiseUtil.step(desc.cases.map(caseDesc => () => this.runCase(caseDesc, desc)));
    }

    async runCase(caseDesc: ICaseDescribe, suiteDesc?: ISuiteDescribe): Promise<ICaseDescribe> {
        try {
            await this.runBeforeEach(suiteDesc);
            await this.runTimeout(
                caseDesc.fn,
                caseDesc.title,
                caseDesc.timeout);

            await this.runAfterEach(suiteDesc);

        } catch (err) {
            caseDesc.error = err;
        }
        return caseDesc;
    }

}

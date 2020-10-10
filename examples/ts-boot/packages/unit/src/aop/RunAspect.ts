import { Aspect, Around, Joinpoint, JoinpointState } from '@tsdi/aop';
import { SuiteRunner, OldTestRunner, ISuiteRunner } from '../runner';
import { LoggerAspect } from '@tsdi/logs';
import { ContainerToken, IContainer } from '@tsdi/core';
import { TestReport } from '../reports/TestReport';
import { ITestReport, ISuiteDescribe, ICaseDescribe } from '../reports/ITestReport';
import { Inject } from '@tsdi/ioc';

@Aspect({
    within: [SuiteRunner, OldTestRunner],
    singleton: true
})
export class RunAspect extends LoggerAspect {

    constructor(@Inject(ContainerToken) container: IContainer) {
        super(container);
    }

    report: ITestReport;
    getReport(): ITestReport {
        if (!this.report) {
            this.report = this.container.resolve(TestReport);
        }
        return this.report;
    }

    @Around('execution(*.runSuite)')
    logBefore(joinPoint: Joinpoint) {
        let runner = joinPoint.target as ISuiteRunner;
        let desc = joinPoint.args[0] as ISuiteDescribe;
        switch (joinPoint.state) {
            case JoinpointState.Before:
                this.getReport().addSuite(runner.getBootType() || desc.describe, desc);
                break;
            case JoinpointState.AfterReturning:
            case JoinpointState.AfterThrowing:
                this.getReport().setSuiteCompleted(runner.getBootType() || desc.describe);
                break;
        }
    }

    @Around('execution(*.runCase)')
    logTestCase(joinPoint: Joinpoint) {
        let desc = joinPoint.args[0] as ICaseDescribe;
        let suiteDesc = joinPoint.args.length > 1 ? joinPoint.args[1] : {};
        let runner = joinPoint.target as SuiteRunner;
        switch (joinPoint.state) {
            case JoinpointState.Before:
                this.getReport().addCase(runner.getBootType() || suiteDesc.describe, desc);
                break;
            case JoinpointState.AfterReturning:
            case JoinpointState.AfterThrowing:
                this.getReport().setCaseCompleted(desc);
                break;
        }
    }

}

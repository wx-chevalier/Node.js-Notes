import { Injectable, isString, isClass, isArray, PromiseUtil, hasClassMetadata } from '@tsdi/ioc';
import { Runnable, BuilderService } from '@tsdi/boot';
import { UnitTestConfigure } from '../UnitTestConfigure';
import { OldTestRunner } from './OldTestRunner';
import { Suite } from '../decorators';
import { TestReport } from '../reports';


/**
 * Suite runner.
 *
 * @export
 * @class SuiteRunner
 * @implements {IRunner<any>}
 */
@Injectable
export class UnitTestRunner extends Runnable<any> {

    async run(data?: any): Promise<any> {
        let mgr = this.context.getConfigureManager<UnitTestConfigure>();
        let config = await mgr.getConfig();
        let src = config.src;
        let container = this.getContainer();
        let suites: any[] = [];

        let oldRunner = container.resolve(OldTestRunner);
        let loader = container.getLoader();
        oldRunner.registerGlobalScope();
        if (isString(src)) {
            let alltypes = await loader.loadTypes({ files: [src] });
            alltypes.forEach(tys => {
                suites = suites.concat(tys);
            })
        } else if (isClass(src)) {
            suites = [src];
        } else if (isArray(src)) {
            if (src.some(t => isClass(t))) {
                suites = src;
            } else {
                let alltypes = await loader.loadTypes({ files: src });
                alltypes.forEach(tys => {
                    suites = suites.concat(tys);
                })
            }
        }
        oldRunner.unregisterGlobalScope();
        await oldRunner.run();
        let builder = container.resolve(BuilderService);
        await PromiseUtil.step(suites.filter(v => isClass(v) && hasClassMetadata(Suite, v)).map(s => () => builder.run(s)));
        await container.resolve(TestReport).report();
    }
}

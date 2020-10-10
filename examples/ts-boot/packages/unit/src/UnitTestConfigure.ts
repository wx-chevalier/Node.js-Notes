import { BootOption, RunnableConfigure } from '@tsdi/boot';
import { Type } from '@tsdi/ioc';
import { ITestReport } from './reports';

/**
 * unit test options.
 *
 * @export
 * @interface UnitTestOptions
 * @extends {BootOption}
 */
export interface UnitTestOptions extends BootOption {
    configures?: (string | UnitTestConfigure)[];
}

/**
 * unit test configure.
 *
 * @export
 * @interface UnitTestConfigure
 * @extends {AppConfigure}
 */
export interface UnitTestConfigure extends RunnableConfigure {
    /**
     * test source
     *
     * @type {(string | Type | (string | Type)[])}
     * @memberof UnitTestConfigure
     */
    src?: string | Type | (string | Type)[];
    /**
     * resports.
     *
     * @type {Token<ITestReport>[]}
     * @memberof UnitTestConfigure
     */
    reporters?: Type<ITestReport>[];
}


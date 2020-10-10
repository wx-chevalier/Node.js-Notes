import { ConfigureRegister } from '@tsdi/boot';
import { DebugLogAspect } from '@tsdi/logs';
import { Singleton, isArray } from '@tsdi/ioc';
import { UnitTestConfigure } from './UnitTestConfigure';
import { Assert, ExpectToken } from './assert';
import * as assert from 'assert';
import * as expect from 'expect';

/**
 * unit test configure register.
 *
 * @export
 * @class UnitTestConfigureRegister
 * @extends {ConfigureRegister}
 */
@Singleton
export class UnitTestConfigureRegister extends ConfigureRegister {
    constructor() {
        super();
    }
    async register(config: UnitTestConfigure): Promise<void> {
        if (config.debug) {
            this.container.register(DebugLogAspect);
        }
        if (!this.container.has(Assert)) {
            this.container.bindProvider(Assert, () => assert);
        }
        if (!this.container.has(ExpectToken)) {
            this.container.bindProvider(ExpectToken, () => expect);
        }
        if (isArray(config.reporters) && config.reporters.length) {
            this.container.use(...config.reporters);
        }
    }
}

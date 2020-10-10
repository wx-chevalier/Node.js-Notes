import { Abstract } from '@tsdi/ioc';

@Abstract()
export abstract class ModuleBuilder {
    constructor() {

    }

    abstract build<T>(target: T): Promise<T>;
}

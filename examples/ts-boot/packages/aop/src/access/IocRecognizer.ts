import { IocCoreService } from '@tsdi/ioc';


/**
 * recognize the vaule is special alias for registor to container.
 *
 * @export
 * @interface IRecognizer
 */
export abstract class IocRecognizer extends IocCoreService {
    constructor() {
        super();
    }
    /**
     * recognize the special alias of value.
     *
     * @param {*} value
     * @returns {string}
     * @memberof IRecognizer
     */
    abstract recognize(value: any): string;
}

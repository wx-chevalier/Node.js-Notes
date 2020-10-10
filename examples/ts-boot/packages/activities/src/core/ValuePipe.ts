import { ActivityContext } from './ActivityContext';
import { Abstract } from '@tsdi/ioc';


/**
 * value pipe.
 *
 * @export
 * @abstract
 * @class ValuePipe
 */
@Abstract()
export abstract class ValuePipe {

    constructor() {

    }

    /**
     * transform date
     *
     * @abstract
     * @param {*} value
     * @returns {Promise<any>}
     * @memberof ValuePipe
     */
    abstract transform(value: any): Promise<any>;

    /**
     * refresh context
     *
     * @abstract
     * @param {ActivityContext} ctx
     * @param {*} value
     * @returns {Promise<void>}
     * @memberof ValuePipe
     */
    refresh?(ctx: ActivityContext, value: any): Promise<void>;

}

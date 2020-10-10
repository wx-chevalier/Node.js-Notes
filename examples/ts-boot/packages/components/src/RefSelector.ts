import { Abstract, Injectable } from '@tsdi/ioc';


/**
 * ref element identfy selector.
 *
 * @export
 * @abstract
 * @class RefIdentfy
 */
@Abstract()
export abstract class RefSelector {
    /**
     * select ref tag in element.
     *
     * @abstract
     * @param {*} element
     * @param {string} selector
     * @returns {*}
     * @memberof RefSelector
     */
    abstract select(element: any, selector: string): any;
}


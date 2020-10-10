import { IHandleContext } from '../handles';
import { Injectable, Inject, ContainerFactoryToken } from '@tsdi/ioc';
import { IContainer } from '@tsdi/core';

/**
 * message option
 *
 * @export
 * @interface MessageOption
 */
export interface MessageOption {
    /**
     * message type
     *
     * @type {string}
     * @memberof MessageContext
     */
    type?: string;
    /**
     * message event
     *
     * @type {string}
     * @memberof MessageContext
     */
    event: string;

    /**
     * message data.
     *
     * @type {*}
     * @memberof MessageContext
     */
    data?: any;
}

/**
 * message context.
 *
 * @export
 * @class MessageContext
 * @extends {HandleContext}
 */
@Injectable
export class MessageContext implements IHandleContext {

    @Inject(ContainerFactoryToken)
    protected raiseContainerGetter: () => IContainer;

    constructor() {
    }

    getContainerFactory() {
        return this.raiseContainerGetter;
    }

    getRaiseContainer(): IContainer {
        return this.raiseContainerGetter();
    }

    /**
     * message type
     *
     * @type {string}
     * @memberof MessageContext
     */
    type?: string;
    /**
     * message event
     *
     * @type {string}
     * @memberof MessageContext
     */
    event: string;

    /**
     * message data.
     *
     * @type {*}
     * @memberof MessageContext
     */
    data?: any;

    /**
     * set options.
     *
     * @param {MessageOption} options
     * @memberof IocActionContext
     */
    setOptions(options: MessageOption) {
        if (options) {
            Object.assign(this, options);
        }
    }
}



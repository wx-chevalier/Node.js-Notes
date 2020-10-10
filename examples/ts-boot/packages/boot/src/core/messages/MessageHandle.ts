import { Handle } from '../handles';
import { Abstract } from '@tsdi/ioc';
import { MessageContext } from './MessageContext';


/**
 * message handle.
 *
 * @export
 * @abstract
 * @class MessageHandle
 * @extends {Middleware<MessageContext>}
 */
@Abstract()
export abstract class MessageHandle<T extends MessageContext> extends Handle<T> {
    /**
     * execute middleware.
     *
     * @abstract
     * @param {T} ctx
     * @param {() => Promise<void>} next
     * @returns {Promise<void>}
     * @memberof AnnoationMiddleware
     */
    abstract execute(ctx: T, next: () => Promise<void>): Promise<void>;
}

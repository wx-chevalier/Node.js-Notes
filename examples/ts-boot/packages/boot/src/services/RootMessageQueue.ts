import { MessageContext, RootMessageQueueToken, MessageQueue } from '../core';
import { Singleton } from '@tsdi/ioc';


/**
 * message queue.
 *
 * @export
 * @class MessageQueue
 * @extends {BuildHandles<T>}
 * @template T
 */

@Singleton(RootMessageQueueToken)
export class RootMessageQueue<T extends MessageContext = MessageContext> extends MessageQueue<T> {

}

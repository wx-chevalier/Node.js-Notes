import { HandleType, IHandle } from '../handles';
import { MessageContext, MessageOption } from './MessageContext';
import { InjectToken, ProviderTypes, Token } from '@tsdi/ioc';

/**
 * application message handle.
 *
 * @export
 * @interface IMessage
 * @template T
 */
export interface IMessage<T extends MessageContext = MessageContext> {
    execute(ctx: T, next: () => Promise<void>): Promise<void>
}

/**
 * message queue.
 *
 * @export
 * @interface IMessageQueue
 * @template T
 */
export interface IMessageQueue<T extends MessageContext = MessageContext> extends IMessage<T> {

    /**
     * send message
     *
     * @param {T} ctx message context
     * @param {() => Promise<void>} [next]
     * @returns {Promise<void>}
     * @memberof IMessageQueue
     */
    send(ctx: T): Promise<void>;
    /**
     * send message
     *
     * @template TOpt
     * @param {TOpt} options
     * @param {() => T} [fac]
     * @returns {Promise<void>}
     * @memberof IMessageQueue
     */
    send<TOpt extends MessageOption>(options: TOpt, fac?: () => T): Promise<void>;
    /**
     * send message
     *
     * @param {string} event
     * @param {*} data
     * @returns {Promise<void>}
     * @memberof IMessageQueue
     */
    send(event: string, data: any, fac?: (...providers: ProviderTypes[]) => T): Promise<void>;

    /**
     * send message
     *
     * @param {string} event
     * @param {string} type
     * @param {*} data
     * @param {(...providers: ProviderTypes[]) => T} [fac]
     * @returns {Promise<void>}
     * @memberof IMessageQueue
     */
    send(event: string, type: string, data: any, fac?: (...providers: ProviderTypes[]) => T): Promise<void>;

    /**
     * subescribe message.
     *
     * @param {(ctx: T, next: () => Promise<void>) => Promise<void>} subscriber
     * @memberof IMessageQueue
     */
    subscribe(subscriber: (ctx: T, next: () => Promise<void>) => Promise<void>);
    /**
     * subscribe message by handle instance;
     *
     * @param {IHandle} handle
     * @memberof IMessageQueue
     */
    subscribe(handle: IHandle);
    /**
     * subscribe message by handle type or token.
     *
     * @param {IHandle} handle
     * @memberof IMessageQueue
     */
    subscribe(handle: Token<IHandle>);

    /**
     * subescribe message.
     *
     * @param {(ctx: T, next: () => Promise<void>) => Promise<void>} subscriber
     * @memberof IMessageQueue
     */
    unsubscribe(subscriber: (ctx: T, next: () => Promise<void>) => Promise<void>);
    /**
     * subscribe message by handle instance;
     *
     * @param {IHandle} handle
     * @memberof IMessageQueue
     */
    unsubscribe(handle: IHandle);
    /**
     * subscribe message by handle type or token.
     *
     * @param {IHandle} handle
     * @memberof IMessageQueue
     */
    unsubscribe(handle: Token<IHandle>);


    /**
     * use message handle
     *
     * @param {HandleType<T>} handle
     * @param {boolean} [setup]
     * @returns {this}
     * @memberof IMessageQueue
     */
    use(handle: HandleType<T>, setup?: boolean): this;

    /**
     * has message handle
     *
     * @param {HandleType<T>} handle
     * @returns {boolean}
     * @memberof IMessageQueue
     */
    has(handle: HandleType<T>): boolean;

    /**
     * use message handle before.
     *
     * @param {HandleType<T>} handle
     * @param {(HandleType<T> | boolean)} before
     * @param {boolean} [setup]
     * @returns {this}
     * @memberof IMessageQueue
     */
    useBefore(handle: HandleType<T>, before: HandleType<T> | boolean, setup?: boolean): this;

    /**
     * use message handle after.
     *
     * @param {HandleType<T>} handle
     * @param {HandleType<T>} [after]
     * @param {boolean} [setup]
     * @returns {this}
     * @memberof IMessageQueue
     */
    useAfter(handle: HandleType<T>, after?: HandleType<T>, setup?: boolean): this;

}

/**
 * root message queue token.
 */
export const RootMessageQueueToken = new InjectToken<IMessageQueue<MessageContext>>('BOOT_ROOT_MessageQueue');

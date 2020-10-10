import { Handles, HandleType, IHandle } from '../handles';
import { isClass, Injectable, isString, ProviderTypes, isFunction, Token } from '@tsdi/ioc';
import { MessageContext, MessageOption } from './MessageContext';
import { IMessageQueue } from './IMessageQueue';

/**
 * composite message.
 *
 * @export
 * @abstract
 * @class MessageQueue
 * @extends {Handles<T>}
 * @template T
 */
@Injectable
export class MessageQueue<T extends MessageContext = MessageContext> extends Handles<T> implements IMessageQueue<T> {

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
    send(event: any, type?: any, data?: any, fac?: () => T): Promise<void> {
        if (event instanceof MessageContext) {
            return this.execute(event as T);
        } else {
            if (isFunction(type)) {
                fac = type;
                type = undefined;
            } else if (isFunction(data)) {
                fac = data;
                data = undefined;
            }
            let ctx = fac ? fac() : this.container.resolve(MessageContext) as T;
            if (isString(event)) {
                if (!isString(type)) {
                    data = type;
                    type = undefined;
                }
                ctx.setOptions({
                    event: event,
                    type: type,
                    data: data
                });
            } else {
                ctx.setOptions(event);
            }
            return this.execute(ctx);
        }
    }

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
    subscribe(handle: Token<IHandle>, setup?: boolean);
    subscribe(haddle: HandleType<T>, setup?: boolean) {
        this.use(haddle, setup);
    }

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
    unsubscribe(haddle: HandleType<T>) {
        this.unuse(haddle);
    }

    protected registerHandle(HandleType: HandleType<T>, setup?: boolean): this {
        if (isClass(HandleType)) {
            this.container.register(HandleType);
        }
        this.use(HandleType);
        return this;
    }
}

import { lang, Type, Abstract, Inject, InjectReference, Token, DecoratorProvider } from '@tsdi/ioc';
import { IContainer } from '@tsdi/core';
import { BootContext } from '../BootContext';
import { BootTargetAccessor } from '../BootTargetAccessor';


/**
 * startup interface. define the type as a startup.
 *
 * @export
 * @interface IRunnable
 * @template T
 * @template TCtx default BootContext
 */
export interface IStartup<T = any, TCtx extends BootContext = BootContext> {
    /**
     * container.
     *
     * @type {IContainer}
     * @memberof IBoot
     */
    getContainer(): IContainer;

    /**
     * runable context.
     *
     * @type {TCtx}
     * @memberof IRunnable
     */
    readonly context?: TCtx;

    /**
     * get boot instance.
     *
     * @type {T}
     * @memberof IBoot
     */
    getBoot(): T;

    /**
     * get boot component node.
     *
     * @returns {*}
     * @memberof IStartup
     */
    getBootNode?(): any;

    /**
     * get boot type.
     *
     * @returns {Type<T>}
     * @memberof IBoot
     */
    getBootType(): Type<T>;

    /**
     * startup runable service.
     *
     * @param {TCtx} [ctx]
     * @returns {(Promise<void | TCtx>)}
     * @memberof IRunnable
     */
    startup(ctx?: TCtx): Promise<void | TCtx>;

}

/**
 * runnablle on init hooks
 *
 * @export
 * @interface RunnableInit
 */
export interface StartupInit {
    /**
     * on init hooks.
     *
     * @returns {(void | Promise<void>)}
     */
    onInit(): void | Promise<void>;
}

/**
 * boot.
 *
 * @export
 * @class Boot
 * @implements {IBoot<T>}
 * @template T
 */
@Abstract()
export abstract class Startup<T = any, TCtx extends BootContext = BootContext> implements IStartup<T, TCtx> {

    protected _ctx: TCtx;
    get context(): TCtx {
        return this._ctx;
    }

    constructor(@Inject(BootContext) ctx: TCtx) {
        this._ctx = ctx as TCtx;
    }

    getContainer(): IContainer {
        return this.context.getRaiseContainer();
    }

    getBoot(): T {
        return this.context.getBootTarget();
    }

    getBootType(): Type<T> {
        return lang.getClass(this.getBoot());
    }

    private _bootNode: any;
    getBootNode(): any {
        if (!this._bootNode) {
            let container = this.getContainer();
            let pdr = container.get(DecoratorProvider);
            let bootTarget = this.getBoot() as any;
            let deckey = pdr.getKey(bootTarget);
            if (deckey && pdr.has(deckey, BootTargetAccessor)) {
                this._bootNode = pdr.resolve(deckey, BootTargetAccessor).getBoot(bootTarget, container);
            } else {
                this._bootNode = bootTarget;
            }
        }
        return this._bootNode;
    }

    /**
     * startup runnable.
     *
     * @abstract
     * @param {TCtx} [ctx]
     * @returns {Promise<void|TCtx>>}
     * @memberof Runnable
     */
    abstract startup(ctx?: TCtx): Promise<void | TCtx>;

}

/**
 * target is Runnable or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Startup}
 */
export function isStartup(target: any): target is Startup {
    if (target instanceof Startup) {
        return true;
    }
    return false;
}


/**
 * module instance starup token.
 *
 * @export
 * @class InjectRunnerToken
 * @extends {Registration<Startup<T>>}
 * @template T
 */
export class InjectStartupToken<T> extends InjectReference<Startup<T>> {
    constructor(type: Token<T>) {
        super(Startup, type);
    }
}

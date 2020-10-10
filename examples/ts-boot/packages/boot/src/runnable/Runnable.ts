import { Abstract, Inject, InjectReference, Token } from '@tsdi/ioc';
import { BootContext } from '../BootContext';
import { IStartup, Startup } from './Startup';


/**
 * runnable interface. define the type as runnable.
 *
 * @export
 * @interface IRunnable
 * @template T
 * @template TCtx default BootContext
 */
export interface IRunnable<T = any, TCtx extends BootContext = BootContext> extends IStartup<T, TCtx> {

    /**
     * run application via boot instance.
     *
     * @param {*} [data]
     * @returns {Promise<any>}
     * @memberof IRunner
     */
    run(data?: any): Promise<any>;

}

/**
 * runnablle on init hooks
 *
 * @export
 * @interface RunnableInit
 */
export interface RunnableInit {
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
export abstract class Runnable<T = any, TCtx extends BootContext = BootContext> extends Startup<T, TCtx> implements IRunnable<T, TCtx> {


    constructor(@Inject(BootContext) ctx: TCtx) {
        super(ctx);
    }

    async startup(ctx: TCtx) {
        await this.run(ctx.data);
    }

    /**
     * run application via boot instance.
     *
     * @param {*} [data]
     * @returns {Promise<any>}
     * @memberof IRunner
     */
    abstract run(data?: any): Promise<any>;

}

/**
 * target is Runnable or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Runnable}
 */
export function isRunnable(target: any): target is Runnable {
    if (target instanceof Runnable) {
        return true;
    }
    return false;
}


/**
 * module instance runner token.
 *
 * @export
 * @class InjectRunnerToken
 * @extends {Registration<Startup<T>>}
 * @template T
 */
export class InjectRunnableToken<T> extends InjectReference<Startup<T>> {
    constructor(type: Token<T>) {
        super(Startup, type);
    }
}


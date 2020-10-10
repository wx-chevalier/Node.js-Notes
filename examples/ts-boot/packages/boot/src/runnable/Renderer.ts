import { Startup, IStartup } from './Startup';
import { BootContext } from '../BootContext';
import { Inject, Abstract, InjectReference, Token } from '@tsdi/ioc';



/**
 * renderer interface. define the type as renderer.
 *
 * @export
 * @interface IRenderer
 * @template T
 * @template TCtx default BootContext
 */
export interface IRenderer<T = any, TCtx extends BootContext = BootContext> extends IStartup<T, TCtx> {

    /**
     * render component instance.
     *
     * @param {*} [data]
     * @returns {Promise<any>}
     * @memberof IRunner
     */
    render(data?: any): Promise<void>;

}

/**
 * runnablle on init hooks
 *
 * @export
 * @interface RendererInit
 */
export interface RendererInit {
    /**
     * on init hooks.
     *
     * @returns {(void | Promise<void>)}
     */
    onInit(): void | Promise<void>;
}

/**
 * renderer for composite.
 *
 * @export
 * @class Boot
 * @implements {IBoot<T>}
 * @template T
 */
@Abstract()
export abstract class Renderer<T = any, TCtx extends BootContext = BootContext> extends Startup<T, TCtx> implements IRenderer<T, TCtx> {

    constructor(@Inject(BootContext) ctx: TCtx) {
        super(ctx);
    }

    async startup(ctx: TCtx) {
        if (!this._ctx) {
            this._ctx = ctx;
        }
        await this.render();
    }

    /**
     * render component instance.
     *
     * @param {*} [data]
     * @returns {Promise<any>}
     * @memberof IRunner
     */
    abstract render(data?: any): Promise<void>;

}

/**
 * target is Renderer or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Renderer}
 */
export function isRenderer(target: any): target is Renderer {
    if (target instanceof Renderer) {
        return true;
    }
    return false;
}


/**
 * module instance renderer token.
 *
 * @export
 * @class InjectRendererToken
 * @extends {Registration<Startup<T>>}
 * @template T
 */
export class InjectRendererToken<T> extends InjectReference<Startup<T>> {
    constructor(type: Token<T>) {
        super(Startup, type);
    }
}


import { IStartup, Startup, StartupInit } from './Startup';
import { Abstract, InjectReference, Token } from '@tsdi/ioc';
import { BootContext } from '../BootContext';

/**
 * IService interface
 *
 * @export
 * @interface IService
 */
export interface IService<T = any, TCtx extends BootContext = BootContext> extends IStartup<T, TCtx> {
    /**
     * start application service.
     *
     * @returns {Promise<any>}
     * @memberof IService
     */
    start?(data?: any): Promise<any>;
    /**
     * stop server.
     *
     * @returns {Promise<any>}
     * @memberof IService
     */
    stop?(): Promise<any>;
}

/**
 * service on init hooks
 *
 * @export
 * @interface ServiceInit
 * @extends {StartupInit}
 */
export interface ServiceInit extends StartupInit {

}

/**
 * base service.
 *
 * @export
 * @abstract
 * @class Service
 * @implements {IService}
 */
@Abstract()
export abstract class Service<T = any, TCtx extends BootContext = BootContext> extends Startup<T, TCtx> implements IService<T, TCtx> {

    async startup(ctx: TCtx) {
        await this.start(ctx.data);
    }

    /**
     * start service.
     *
     * @abstract
     * @param {*} [data]
     * @returns {Promise<any>}
     * @memberof Service
     */
    abstract start?(data?: any): Promise<any>;
    /**
     * stop service.
     *
     * @abstract
     * @returns {Promise<any>}
     * @memberof Service
     */
    abstract stop(): Promise<any>;
}

/**
 * target is Service or not.
 *
 * @export
 * @param {*} target
 * @returns {target is Service}
 */
export function isService(target: any): target is Service {
    if (target instanceof Service) {
        return true;
    }
    return false;
}

/**
 * module instance service token.
 *
 * @export
 * @class InjectServiceToken
 * @extends {Registration<Startup<T>>}
 * @template T
 */
export class InjectServiceToken<T> extends InjectReference<Startup<T>> {
    constructor(type: Token<T>) {
        super(Startup, type);
    }
}

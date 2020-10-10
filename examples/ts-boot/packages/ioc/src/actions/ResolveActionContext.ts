import { ActionContextOption, IocActionContext } from './Action';
import { ProviderTypes } from '../providers';
import { Token, Type } from '../types';
import { isToken } from '../utils';


/**
 * resovle action option.
 *
 * @export
 * @interface ResolveActionOption
 */
export interface ResolveActionOption<T> extends ActionContextOption {
    /**
     * token.
     *
     * @type {Token<T>}
     * @memberof ResolveActionOption
     */
    token?: Token<T>;

    /**
     * register token if has not register.
     *
     * @type {boolean}
     * @memberof ResolveActionOption
     */
    regify?: boolean;
    /**
     * resolver providers.
     *
     * @type {ParamProviders[]}
     * @memberof IResolveContext
     */
    providers?: ProviderTypes[];
}

export function createResolveContext<T, Ctx extends ResolveActionContext<T>>(CtxType: Type<Ctx>, target: Token<T> | ResolveActionOption<T>): Ctx {
    let token: Token;
    let options: ResolveActionOption<T>;
    if (isToken(target)) {
        token = target;
    } else if (target) {
        options = target;
        token = target.token;
    }
    let ctx = new CtxType(token);
    options && ctx.setOptions(options);
    return ctx;
}

/**
 * resolve action context.
 *
 * @export
 * @interface IResolverContext
 */
export class ResolveActionContext<T = any> extends IocActionContext {

    constructor(token: Token<T>) {
        super();
        this.token = token
    }

    /**
     * token.
     *
     * @type {Token}
     * @memberof ResolveContext
     */
    token: Token<T>;

    /**
     * register token if has not register.
     *
     * @type {boolean}
     * @memberof ResolveActionOption
     */
    regify?: boolean;

    /**
     * resolver providers.
     *
     * @type {ParamProviders[]}
     * @memberof IResolveContext
     */
    providers: ProviderTypes[];

    /**
     * reslove result instance.
     *
     * @type {*}
     * @memberof IResolveContext
     */
    instance?: T;


    /**
     * set resolve target.
     *
     * @param {Token} token
     * @param {ProviderTypes[]} [providers]
     * @memberof ResolveContext
     */
    setOptions<T>(options: ResolveActionOption<T>) {
        super.setOptions(options);
    }

    /**
     * create resolve context via options.
     *
     * @static
     * @param {ResolveActionOption} [options]
     * @param {(IIocContainer | (() => IIocContainer))} [raiseContainer]
     * @returns {ResolveActionContext}
     * @memberof ResolveActionContext
     */
    static parse<T>(target?: Token<T> | ResolveActionOption<T>): ResolveActionContext<T> {
        return createResolveContext(ResolveActionContext, target);
    }
}

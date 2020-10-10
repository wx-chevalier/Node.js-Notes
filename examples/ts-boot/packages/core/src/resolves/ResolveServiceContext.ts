import { Token, ResolveActionContext, ResolveActionOption, createResolveContext, ClassType } from '@tsdi/ioc';
import { TargetRef } from '../TargetService';


export type TargetRefType =  Object | TargetRef;

/**
 * service context option.
 *
 * @export
 * @interface ServiceOption
 * @extends {ResovleActionOption}
 */
export interface ServiceOption<T> extends ResolveActionOption<T> {
    /**
     * token provider service type.
     *
     * @type {Type}
     * @memberof ServiceActionOption
     */
    tokens?: Token<T>[];

    /**
     * get extend servie or not.
     *
     * @type {boolean}
     * @memberof ServiceOption
     */
    extend?: boolean;

    /**
     * service reference target.
     *
     * @type {(TargetRefType | TargetRefType[])}
     * @memberof ServiceActionOption
     */
    target?: TargetRefType | TargetRefType[];

    /**
     * reolve this defualt service, if not found any service.
     *
     * @type {Token<T>}
     * @memberof ServiceActionOption
     */
    defaultToken?: Token<T>;

    /**
    * ref target factory.
    *
    * @memberof ResolveServiceContext
    */
    refTargetFactory?: (targetToken: Token, token?: Token) => Token | Token[];

    /**
     * service token factory.
     *
     * @memberof ResolveServiceContext
     */
    serviceTokenFactory?: (token: Token) => Token[];
}

/**
 * service resolve context.
 *
 * @export
 * @class ResolveServiceContext
 * @extends {ResovleActionContext}
 */
export class ResolveServiceContext<T = any> extends ResolveActionContext<T> {

    constructor(token?: Token<T>) {
        super(token)
    }
    /**
     * create resolve context via options.
     *
     * @static
     * @param {ResolveActionOption} [options]
     * @returns {ResolveActionContext}
     * @memberof ResolveActionContext
     */
    static parse<T>(target?: Token<T> | ServiceOption<T>): ResolveServiceContext<T> {
        return createResolveContext<T, ResolveServiceContext<T>>(ResolveServiceContext, target);
    }

    /**
     * curr token.
     *
     * @type {Token}
     * @memberof ServiceActionOption
     */
    currToken?: Token;

    /**
     * get extend servie or not.
     *
     * @type {boolean}
     * @memberof ServiceOption
     */
    extend?: boolean;

    /**
     * service tokens.
     *
     * @type {Type}
     * @memberof ResolveServiceContext
     */
    tokens: Token[];

    /**
     * service reference target.
     *
     * @type {*}
     * @memberof ResolveServiceContext
     */
    target?: any;

    /**
     * target reference services.
     *
     * @type {TargetRef[]}
     * @memberof ResolveServiceContext
     */
    targetRefs?: TargetRef[];

    /**
     * current target ref.
     *
     * @type {TargetRef}
     * @memberof ServiceActionOption
     */
    currTargetRef?: TargetRef;

    currDecorator?: string;

    currTargetToken?: Token;

    currTargetType?: ClassType;
    /**
     * ref target factory.
     *
     * @memberof ResolveServiceContext
     */
    refTargetFactory?: (targetToken: Token, token?: Token) => Token | Token[];

    /**
     * service token factory.
     *
     * @memberof ResolveServiceContext
     */
    serviceTokenFactory?: (token: Token) => Token[];

    /**
     * reolve this defualt service, if not found any service.
     *
     * @type {Token}
     * @memberof ResolveServiceContext
     */
    defaultToken?: Token;

}

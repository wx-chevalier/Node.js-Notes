import { Token, IocResolveAction, isNullOrUndefined, isClassType, lang } from '@tsdi/ioc';
import { ResolveServiceContext } from './ResolveServiceContext';

/**
 * resolve service base action.
 *
 * @export
 * @abstract
 * @class IocResolveServiceAction
 * @extends {IocResolveAction}
 */
export abstract class IocResolveServiceAction extends IocResolveAction<ResolveServiceContext> {

    protected get(ctx: ResolveServiceContext, token: Token) {
        if (!ctx.instance && this.container.has(token)) {
            ctx.instance = this.container.get(token, ...ctx.providers);
        }
    }

    protected resolve(ctx: ResolveServiceContext, token: Token) {
        if (!ctx.instance) {
            ctx.instance = this.container.get(token, ...ctx.providers);
            if (ctx.extend && isNullOrUndefined(ctx.instance) && isClassType(token)) {
                this.container.iterator((fac, k) => {
                    if (isNullOrUndefined(ctx.instance) && isClassType(k) && lang.isExtendsClass(k, token)) {
                        ctx.instance = fac(...ctx.providers);
                        return false;
                    }
                    return true;
                });
            }
        }
    }
}

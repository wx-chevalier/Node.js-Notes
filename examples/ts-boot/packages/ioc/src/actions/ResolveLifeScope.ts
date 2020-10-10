import { Token } from '../types';
import { ProviderTypes } from '../providers';
import { ResolveActionContext, ResolveActionOption } from './ResolveActionContext';
import { IocResolveScope } from './IocResolveScope';

export class ResolveLifeScope<T> extends IocResolveScope<ResolveActionContext<T>> {

    execute(ctx: ResolveActionContext, next?: () => void): void {
        if (!ctx.instance) {
            super.execute(ctx, next);
        }
    }

    setup() {
        this.use(IocResolveScope, true);
    }

    /**
     * resolve token in resolve chain.
     *
     * @template T
     * @param {(Token<T> | ResolveActionOption<T> | ResolveActionContext<T>)} token
     * @param {...ProviderTypes[]} providers
     * @returns {T}
     * @memberof ResolveLifeScope
     */
    resolve<T>(token: Token<T> | ResolveActionOption<T> | ResolveActionContext<T>, ...providers: ProviderTypes[]): T {
        let ctx: ResolveActionContext<T>;
        if (token instanceof ResolveActionContext) {
            ctx = token;
        } else {
            ctx = ResolveActionContext.parse(token);
        }
        if (!ctx) {
            return null;
        }
        ctx.providers = [...(ctx.providers || []), ...providers];
        this.container.getActionRegisterer().get(ResolveLifeScope).execute(ctx);
        return ctx.instance;
    }
}

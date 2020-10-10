import { IocResolveAction } from '../IocResolveAction';
import { ResolveActionContext } from '../ResolveActionContext';
import { isClass } from '../../utils';

export class IocDefaultResolveAction extends IocResolveAction {
    execute(ctx: ResolveActionContext, next: () => void): void {
        if (!ctx.instance && this.container.has(ctx.token)) {
            ctx.instance = this.container.get(ctx.token, ...ctx.providers);
        }

        if (!ctx.instance) {
            next();
        }

        if (!ctx.instance && ctx.regify && isClass(ctx.token) && !this.container.has(ctx.token)) {
            this.container.register(ctx.token);
            ctx.instance = this.container.get(ctx.token, ...ctx.providers);
        }
    }
}

import { ResolveServiceContext } from '@tsdi/core';
import { IocCompositeAction } from '@tsdi/ioc';
import { ResolveModuleExportAction } from './ResolveModuleExportAction';
import { ResolveParentServiceAction } from './ResolveParentServiceAction';
import { ContainerPoolToken } from '../ContainerPoolToken';



export class ResolveRouteServiceAction extends IocCompositeAction<ResolveServiceContext>  {
    execute(ctx: ResolveServiceContext, next?: () => void): void {
        if (this.container.has(ContainerPoolToken)) {
            let token = ctx.token;
            ctx.token = ctx.currToken || ctx.token;
            super.execute(ctx);
            if (!ctx.instance) {
                ctx.token = token;
                next && next();
            }
        } else {
            next && next();
        }
    }

    protected setScope(ctx: ResolveServiceContext, parentScope?: any) {
        if (!ctx.actionScope) {
            ctx.actionScope = this;
        }
    }

    setup() {
        this.use(ResolveModuleExportAction)
            .use(ResolveParentServiceAction);
    }
}

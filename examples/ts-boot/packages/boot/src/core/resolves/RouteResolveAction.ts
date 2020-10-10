import { IocCompositeAction, ResolveActionContext } from '@tsdi/ioc';
import { ContainerPoolToken } from '../ContainerPoolToken';
import { ResolveModuleExportAction } from './ResolveModuleExportAction';
import { ResolveParentAction } from './ResolveParentAction';

export class RouteResolveAction extends IocCompositeAction<ResolveActionContext> {

    execute(ctx: ResolveActionContext, next?: () => void): void {
        if (this.container.has(ContainerPoolToken)) {
            super.execute(ctx);
        }
        if (!ctx.instance) {
            next && next();
        }
    }

    setup() {
        this.use(ResolveModuleExportAction)
            .use(ResolveParentAction);
    }
}

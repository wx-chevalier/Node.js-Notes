import { LifeScope } from '@tsdi/ioc';
import { ResolveServiceContext } from './ResolveServiceContext';
import { InitServiceResolveAction } from './InitServiceResolveAction';
import { ResolveServiceScope } from './ResolveServiceScope';


export class ServiceResolveLifeScope<T> extends LifeScope<ResolveServiceContext<T>> {

    execute(ctx: ResolveServiceContext, next?: () => void): void {
        if (!ctx.instance) {
            super.execute(ctx, next);
        }
    }

    setup() {
        this.use(InitServiceResolveAction)
            .use(ResolveServiceScope, true);
    }
}

import { isClassType, MetadataService, DecoratorProvider } from '@tsdi/ioc';
import { IocResolveServiceAction } from './IocResolveServiceAction';
import { ResolveServiceContext } from './ResolveServiceContext';

export class ResolveDecoratorServiceAction extends IocResolveServiceAction {
    execute(ctx: ResolveServiceContext, next: () => void): void {
        if (isClassType(ctx.currTargetType)) {
            let dprvoider = this.container.get(DecoratorProvider);
            this.container
                .get(MetadataService)
                .getClassDecorators(ctx.currTargetType)
                .some(dec => {
                    if (dprvoider.has(dec)) {
                        ctx.instance = dprvoider.resolve(dec, ctx.currToken || ctx.token, ...ctx.providers || []);
                        return !!ctx.instance;
                    } else {
                        return false;
                    }
                });
        }

        if (!ctx.instance) {
            ctx.currDecorator = null;
            return next();
        }
    }
}

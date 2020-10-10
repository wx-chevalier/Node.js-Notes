import {
    IocDesignAction, IocRuntimeAction, lang, Type, RuntimeActionContext,
    DesignActionContext, IocCompositeAction
} from '@tsdi/ioc';
import { ParentContainerToken } from '../ContainerPoolToken';

export class RouteRuntimRegisterAction extends IocRuntimeAction {
    execute(ctx: RuntimeActionContext, next: () => void): void {
        if (ctx.actionScope && this.container.has(ParentContainerToken)) {
            let scopeType: Type<IocCompositeAction> = lang.getClass(ctx.actionScope);
            let parent = this.container.get(ParentContainerToken);
            if (parent && parent !== this.container) {
                parent.getActionRegisterer().get(scopeType).execute(ctx, next);
            }
        } else {
            next();
        }
    }
}

export class RouteDesignRegisterAction extends IocDesignAction {
    execute(ctx: DesignActionContext, next: () => void): void {
        if (ctx.actionScope && this.container.has(ParentContainerToken)) {
            let scopeType: Type<IocCompositeAction> = lang.getClass(ctx.actionScope);
            let parent = this.container.get(ParentContainerToken);
            if (parent && parent !== this.container) {
                parent.getActionRegisterer().get(scopeType).execute(ctx, next);
            }
        } else {
            next();
        }
    }
}


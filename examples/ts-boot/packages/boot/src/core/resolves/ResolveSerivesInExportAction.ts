import {
    ResolveServicesContext, IocResolveServicesAction, ResolveServicesScope
} from '@tsdi/core';
import { DIModuleExports } from '../injectors';
import { IModuleResolver } from '../modules';


export class ResolveSerivesInExportAction extends IocResolveServicesAction {

    execute(ctx: ResolveServicesContext, next: () => void): void {
        this.container.get(DIModuleExports).getResolvers()
            .forEach(r => {
                this.depIterator(ctx, r);
            });

        next();
    }

    depIterator(ctx: ResolveServicesContext, resolver: IModuleResolver) {
        resolver.getContainer()
            .getActionRegisterer()
            .get(ResolveServicesScope).execute(ctx);
        if (resolver.has(DIModuleExports)) {
            resolver.resolve(DIModuleExports).getResolvers()
                .forEach(r => {
                    this.depIterator(ctx, r);
                })
        }
    }
}

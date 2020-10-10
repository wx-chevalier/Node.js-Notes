import { IocResolveServicesAction } from './IocResolveServicesAction';
import { isToken, InjectReference, ProviderTypes } from '@tsdi/ioc';
import { ResolveServicesContext } from './ResolveServicesContext';


export class ResovleServicesRefsAction extends IocResolveServicesAction {
    execute(ctx: ResolveServicesContext, next: () => void): void {
        if (ctx.targetRefs && ctx.targetRefs.length) {
            ctx.targetRefs.forEach(t => {
                let tk = isToken(t) ? t : t.getToken();
                ctx.types.forEach(ty => {
                    let reftk = new InjectReference(ty, tk);
                    if (this.container.has(reftk)) {
                        ctx.services.register(reftk, (...providers: ProviderTypes[]) => this.container.get(reftk, ...providers))
                    }
                });
            })
        }
        next();
    }
}

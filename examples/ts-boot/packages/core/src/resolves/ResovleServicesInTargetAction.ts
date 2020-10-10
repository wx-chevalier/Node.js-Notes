import { IocResolveServicesAction } from './IocResolveServicesAction';
import { isToken, InjectReference, ProviderMap, isClassType, lang, ProviderTypes } from '@tsdi/ioc';
import { ResolveServicesContext } from './ResolveServicesContext';


export class ResovleServicesInTargetAction extends IocResolveServicesAction {
    execute(ctx: ResolveServicesContext, next: () => void): void {
        if (ctx.targetRefs && ctx.targetRefs.length) {
            ctx.targetRefs.forEach(t => {
                let tk = isToken(t) ? t : t.getToken();
                let maps = this.container.get(new InjectReference(ProviderMap, tk));
                if (maps && maps.size) {
                    maps.iterator((fac, tk) => {
                        if (isClassType(tk) && ctx.types.some(ty => lang.isExtendsClass(tk, ty))) {
                            ctx.services.register(tk, (...providers: ProviderTypes[]) => fac(...providers));
                        }
                    })
                }
            });
            if (ctx.both) {
                next();
            }
        } else {
            next();
        }
    }
}

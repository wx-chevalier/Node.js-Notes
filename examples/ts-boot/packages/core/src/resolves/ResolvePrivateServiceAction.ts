import { InjectReference, ProviderMap, Token, isToken, isClassType, isNullOrUndefined, lang } from '@tsdi/ioc';
import { ResolveServiceContext } from './ResolveServiceContext';
import { IocResolveServiceAction } from './IocResolveServiceAction';
import { TargetPrivateService } from '../TargetService';

export class ResolvePrivateServiceAction extends IocResolveServiceAction {
    execute(ctx: ResolveServiceContext, next: () => void): void {
        // resolve private service.
        this.resolvePrivate(ctx, ctx.currToken || ctx.token);
        if (!ctx.instance) {
            next();
        }
    }

    protected resolvePrivate(ctx: ResolveServiceContext, token: Token) {
        if (ctx.currTargetRef && (isToken(ctx.currTargetRef) || ctx.currTargetRef instanceof TargetPrivateService)) {
            if (!isClassType(ctx.currTargetType)) {
                return;
            }
            let tk = new InjectReference(ProviderMap, ctx.currTargetType);
            if (tk !== token) {
                let map = this.container.has(tk) ? this.container.get(tk) : null;
                if (map && map.has(token)) {
                    ctx.instance = map.resolve(token, ...ctx.providers);
                }
                if (ctx.extend && isNullOrUndefined(ctx.instance) && isClassType(token)) {
                    let extk = map.keys().find(k => isClassType(k) && lang.isExtendsClass(k, token));
                    if (extk) {
                        ctx.instance = map.resolve(extk, ...ctx.providers);
                    }
                }
            }
        }
    }
}

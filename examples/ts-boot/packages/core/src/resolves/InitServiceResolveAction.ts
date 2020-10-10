import { isFunction, isToken, isArray, lang, isClassType, isClass } from '@tsdi/ioc';
import { ResolveServiceContext } from './ResolveServiceContext';
import { IocResolveServiceAction } from './IocResolveServiceAction';
import { TargetService } from '../TargetService';
import { ResolveServicesContext } from './ResolveServicesContext';

export class InitServiceResolveAction extends IocResolveServiceAction {
    execute(ctx: ResolveServiceContext, next: () => void): void {
        if (ctx.target) {
            ctx.targetRefs = (isArray(ctx.target) ? ctx.target : [ctx.target])
                .map(t => {
                    if (t instanceof TargetService) {
                        return t;
                    } else if (t) {
                        return isToken(t) ? t : lang.getClass(t);
                    }
                    return null;
                })
                .filter(t => t);
        }
        ctx.tokens = ctx.tokens || [];
        if (ctx.token) {
            if (isFunction(ctx.serviceTokenFactory)) {
                ctx.tokens = (ctx.serviceTokenFactory(ctx.token) || []).concat(ctx.tokens);
            } else {
                ctx.tokens.push(ctx.token);
            }
        }

        if (ctx instanceof ResolveServicesContext) {
            ctx.tokens = ctx.tokens.filter(t => isToken(t));
            ctx.types = ctx.types || [];
            ctx.types = ctx.tokens.map(t => {
                if (isClassType(t)) {
                    return t;
                } else {
                    return this.container.getTokenProvider(t);
                }
            }).concat(ctx.types).filter(ty => isClassType(ty));
            next();

        } else {
            if (!isClassType(ctx.token)) {
                let pdType = this.container.getTokenProvider(ctx.token);
                if (pdType) {
                    ctx.tokens.push(pdType);
                }
            }
            ctx.tokens = ctx.tokens.filter(t => isToken(t));
            next();

            if (!ctx.instance && ctx.regify && isClass(ctx.token) && !this.container.has(ctx.token)) {
                this.container.register(ctx.token);
                ctx.instance = this.container.get(ctx.token, ...ctx.providers);
            }
            // resolve default.
            if (!ctx.instance && ctx.defaultToken) {
                this.resolve(ctx, ctx.defaultToken);
            }
        }
    }
}

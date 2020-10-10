import { isArray, InjectReference, isToken } from '@tsdi/ioc';
import { ResolveServiceContext } from './ResolveServiceContext';
import { TargetRefService } from '../TargetService';
import { ResolvePrivateServiceAction } from './ResolvePrivateServiceAction';

export class ResolveRefServiceAction extends ResolvePrivateServiceAction {
    execute(ctx: ResolveServiceContext, next?: () => void): void {
        if (ctx.currToken && !(ctx.currToken instanceof InjectReference) && (isToken(ctx.currTargetRef) || ctx.currTargetRef instanceof TargetRefService)) {
            let currtk = ctx.currToken;
            let targetTk = ctx.currTargetToken;
            let refTk = ctx.refTargetFactory ? ctx.refTargetFactory(targetTk, currtk) : new InjectReference(currtk, targetTk);
            let refTks = isArray(refTk) ? refTk : [refTk];
            if (!refTks.some(tk => {
                this.resolvePrivate(ctx, tk);
                if (!ctx.instance) {
                    this.get(ctx, tk);
                }
                return !!ctx.instance;
            })) {
                ctx.currToken = currtk;
                next();
            }

        } else {
            next();
        }
    }
}

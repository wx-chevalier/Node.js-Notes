import { IocResolveScope, lang, isClassType, isToken } from '@tsdi/ioc';
import { ResolveServiceContext } from './ResolveServiceContext';
import { TargetService } from '../TargetService';
import { ResolveRefServiceAction } from './ResolveRefServiceAction';
import { ResolvePrivateServiceAction } from './ResolvePrivateServiceAction';

export class ResolveServiceInClassChain extends IocResolveScope {
    execute(ctx: ResolveServiceContext, next?: () => void): void {
        if (ctx.currTargetRef) {
            let currTgRef = ctx.currTargetRef;
            let classType = ctx.currTargetType;
            let currTagTk = ctx.currTargetToken;
            if (isClassType(classType)) {
                lang.forInClassChain(classType, ty => {
                    if (currTgRef instanceof TargetService) {
                        ctx.currTargetRef = currTgRef.clone(ty);
                    } else {
                        ctx.currTargetRef = ty;
                    }
                    ctx.currTargetToken = isToken(ctx.currTargetRef) ? ctx.currTargetRef : ctx.currTargetRef.getToken();
                    ctx.currTargetType = isClassType(ctx.currTargetToken) ? ctx.currTargetToken : this.container.getTokenProvider(ctx.currTargetToken);
                    super.execute(ctx);
                    return !ctx.instance;
                });
            } else {
                super.execute(ctx);
            }
            if (!ctx.instance) {
                ctx.currTargetRef = currTgRef;
                ctx.currTargetToken = currTagTk;
                ctx.currTargetType = classType;
                next && next();
            }
        } else {
            next && next();
        }
    }

    setup() {
        this.use(ResolveRefServiceAction)
            .use(ResolvePrivateServiceAction);
    }
}

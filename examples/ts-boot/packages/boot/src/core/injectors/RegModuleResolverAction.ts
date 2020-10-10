import { AnnoationAction } from './AnnoationAction';
import { AnnoationContext } from '../AnnoationContext';
import { IDIModuleReflect } from '../modules';
import { ModuleResovler } from './ModuleResovler';

export class RegModuleResolverAction extends AnnoationAction {
    execute(ctx: AnnoationContext, next: () => void): void {
        let annoation = ctx.annoation;
        let container = ctx.getRaiseContainer();
        let mdResolver = new ModuleResovler(annoation.token || ctx.module, annoation, container, ctx.module, ctx.exports);
        let reflect = container.getTypeReflects().get<IDIModuleReflect>(ctx.module);
        if (reflect) {
            reflect.moduleResolver = mdResolver;
        }
        ctx.moduleResolver = mdResolver;
        next();
    }
}

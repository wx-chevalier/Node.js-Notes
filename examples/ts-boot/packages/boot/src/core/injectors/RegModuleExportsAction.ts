import { AnnoationAction } from './AnnoationAction';
import { AnnoationContext } from '../AnnoationContext';
import { ContainerPoolToken } from '../ContainerPoolToken';
import { DIModuleExports } from './DIModuleExports';
import { RegFor } from '../modules';

export class RegModuleExportsAction extends AnnoationAction {
    execute(ctx: AnnoationContext, next: () => void): void {
        if (ctx.moduleResolver && ctx.regFor === RegFor.child) {
            let pool = this.container.get(ContainerPoolToken);
            let parent = pool.getParent(ctx.getRaiseContainer());
            if (parent) {
                let diexports = parent.resolve(DIModuleExports);
                diexports.use(ctx.moduleResolver);
            }
        }
        next();
    }
}

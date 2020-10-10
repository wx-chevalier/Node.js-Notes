import { AnnoationAction } from './AnnoationAction';
import { AnnoationContext } from '../AnnoationContext';

export class RegModuleAction extends AnnoationAction {
    execute(ctx: AnnoationContext, next: () => void): void {
        ctx.getRaiseContainer().register(ctx.module);
        next();
    }
}

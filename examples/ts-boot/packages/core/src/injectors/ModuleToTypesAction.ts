import { InjectorAction } from './InjectorAction';
import { InjectorActionContext } from './InjectorActionContext';
import { ModuleLoader } from '../services';

export class ModuleToTypesAction extends InjectorAction {
    execute(ctx: InjectorActionContext, next: () => void): void {
        if (!ctx.types) {
            ctx.types = this.container.get(ModuleLoader).getTypes(ctx.module);
        }
        ctx.registered = ctx.registered || [];
        next();
    }
}

import { IocRuntimeAction } from './IocRuntimeAction';
import { RuntimeActionContext } from './RuntimeActionContext';


export class CreateInstanceAction extends IocRuntimeAction {
    execute(ctx: RuntimeActionContext, next: () => void): void {
        if (!ctx.target) {
            ctx.target = new ctx.targetType(...ctx.args);
        }
        next();
    }
}

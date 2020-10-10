import { IocRuntimeAction } from './IocRuntimeAction';
import { RuntimeActionContext } from './RuntimeActionContext';

export class InstanceCheckAction  extends IocRuntimeAction {
    execute(ctx: RuntimeActionContext, next: () => void): void {
        if (!ctx.target) {
            return;
        }
        next();
    }
}

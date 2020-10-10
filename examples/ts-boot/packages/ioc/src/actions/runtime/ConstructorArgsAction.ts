import { RuntimeActionContext } from './RuntimeActionContext';
import { RuntimeParamScope } from './RuntimeParamScope';
import { IocRegisterScope } from '../IocRegisterScope';

/**
 * resolve constructor args action.
 *
 * @export
 * @class ConstructorArgsAction
 * @extends {IocRuntimeAction}
 */
export class ConstructorArgsAction extends IocRegisterScope<RuntimeActionContext> {

    execute(ctx: RuntimeActionContext, next: () => void): void {
        if (!ctx.args) {
            if (ctx.targetReflect.methodParams.has('constructor')) {
                ctx.params = ctx.targetReflect.methodParams.get('constructor');
            } else {
                this.container.getActionRegisterer().get(RuntimeParamScope)
                    .execute(ctx);
                ctx.params = ctx.targetReflect.methodParams.get('constructor');
            }
            ctx.args = this.container.createParams(ctx.params, ctx.providerMap);
        }
        next();
    }
}

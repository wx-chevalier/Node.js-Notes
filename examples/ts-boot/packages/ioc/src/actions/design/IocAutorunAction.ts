import { AutorunMetadata } from '../../metadatas';
import { isFunction } from '../../utils';
import { IocDesignAction } from './IocDesignAction';
import { getOwnTypeMetadata, hasOwnClassMetadata } from '../../factories';
import { DesignActionContext } from './DesignActionContext';
/**
 * method auto run action.
 *
 * @export
 * @class SetPropAction
 * @extends {IocDesignAction}
 */
export class IocAutorunAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void) {
        this.runAuto(ctx);
        next();
    }

    protected runAuto(ctx: DesignActionContext) {
        if (!hasOwnClassMetadata(ctx.currDecoractor, ctx.targetType)) {
            return;
        }
        let metadatas = getOwnTypeMetadata<AutorunMetadata>(ctx.currDecoractor, ctx.targetType);
        metadatas.forEach(meta => {
            if (meta && meta.autorun) {
                let instance = this.container.get(ctx.tokenKey || ctx.targetType);
                if (instance && isFunction(instance[meta.autorun])) {
                    this.container.invoke(instance, meta.autorun);
                }
            }
        });
    }
}

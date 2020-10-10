import { IocRuntimeAction } from './IocRuntimeAction';
import { RuntimeActionContext } from './RuntimeActionContext';
import { hasMethodMetadata, getMethodMetadata } from '../../factories';
import { AutorunMetadata } from '../../metadatas';
import { lang, isNumber } from '../../utils';
/**
 * method auto run action.
 *
 * @export
 * @class SetPropAction
 * @extends {IocRuntimeAction}
 */
export class MethodAutorunAction extends IocRuntimeAction {

    execute(ctx: RuntimeActionContext, next: () => void) {
        this.runAuto(ctx);
        next();
    }

    protected runAuto(ctx: RuntimeActionContext) {
        if (hasMethodMetadata(ctx.currDecoractor, ctx.targetType)) {
            let metas = getMethodMetadata<AutorunMetadata>(ctx.currDecoractor, ctx.targetType);
            let lastmetas: AutorunMetadata[] = [];
            let idx = Object.keys(metas).length;
            lang.forIn(metas, (mm, key: string) => {
                if (mm && mm.length) {
                    let m = mm[0];
                    m.autorun = key;
                    idx++;
                    if (!isNumber(m.order)) {
                        m.order = idx;
                    }
                    lastmetas.push(m);
                }
            });

            lastmetas.sort((au1, au2) => {
                return au1.order - au2.order;
            }).forEach(aut => {
                this.container.invoke(ctx.target || ctx.targetType, aut.autorun, ctx.target);
            });
        }
    }
}


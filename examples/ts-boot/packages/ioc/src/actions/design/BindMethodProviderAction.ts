import { getOwnMethodMetadata } from '../../factories';
import { MethodMetadata } from '../../metadatas';
import { isArray, lang } from '../../utils';
import { DesignActionContext } from './DesignActionContext';
import { IocDesignAction } from './IocDesignAction';


/**
 * bind method provider action.
 *
 * @export
 * @class BindMethodProviderAction
 * @extends {ActionComposite}
 */
export class BindMethodProviderAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void) {

        lang.forInClassChain(ctx.targetType, ty => {
            let metas = getOwnMethodMetadata<MethodMetadata>(ctx.currDecoractor, ty);

            Object.keys(metas).forEach(propertyKey => {
                let metadatas = metas[propertyKey];
                let providers = [];
                if (metadatas && isArray(metadatas) && metadatas.length > 0) {
                    metadatas.forEach(meta => {
                        if (meta.providers && meta.providers.length > 0) {
                            providers = providers.concat(meta.providers);
                        }
                    });
                }
                if (ctx.targetReflect.methodParamProviders.has(propertyKey)) {
                    ctx.targetReflect.methodParamProviders.get(propertyKey).push(...providers);
                } else {
                    ctx.targetReflect.methodParamProviders.set(propertyKey, providers);
                }
            });

        });

        next();
    }
}

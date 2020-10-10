import { DesignActionContext } from './DesignActionContext';
import { IocDesignAction } from './IocDesignAction';
import { getOwnTypeMetadata } from '../../factories';
import { ClassMetadata } from '../../metadatas';

/**
 * bind provider action. for binding a factory to an token.
 *
 * @export
 * @class BindProviderAction
 * @extends {ActionComposite}
 */
export class BindProviderAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void) {
        let tgReflect = ctx.targetReflect;
        let raiseContainer = ctx.getRaiseContainer();

        let metadatas = getOwnTypeMetadata<ClassMetadata>(ctx.currDecoractor, ctx.targetType);
        metadatas.forEach(anno => {
            // bind all provider.
            if (!anno) {
                return;
            }
            if (anno.provide) {
                let provide = raiseContainer.getToken(anno.provide, anno.alias);
                tgReflect.provides.push(provide);
                raiseContainer.bindProvider(provide, anno.type);
            }
            if (anno.refs && anno.refs.target) {
                raiseContainer.bindRefProvider(anno.refs.target,
                    anno.refs.provide ? anno.refs.provide : anno.type,
                    anno.type,
                    anno.refs.provide ? anno.refs.alias : '',
                    tk => tgReflect.provides.push(tk));
            }
            // class private provider.
            if (anno.providers && anno.providers.length) {
                raiseContainer.bindProviders(
                    anno.type,
                    refKey => tgReflect.provides.push(refKey),
                    ...anno.providers);
            }
        });

        next();
    }
}


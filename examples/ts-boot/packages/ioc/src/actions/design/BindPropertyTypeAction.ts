import { isClass, lang } from '../../utils';
import { IocDesignAction } from './IocDesignAction';
import { DesignActionContext } from './DesignActionContext';
import { getOwnPropertyMetadata } from '../../factories';
import { PropertyMetadata } from '../../metadatas';

/**
 * bind property type action. to get the property autowride token of Type calss.
 *
 * @export
 * @class SetPropAction
 * @extends {ActionComposite}
 */
export class BindPropertyTypeAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void) {
        lang.forInClassChain(ctx.targetType, ty => {
            let propMetas = getOwnPropertyMetadata<PropertyMetadata>(ctx.currDecoractor, ty);
            Object.keys(propMetas).forEach(key => {
                let props = propMetas[key];
                props.forEach(prop => {
                    if (isClass(prop.provider) && !this.container.has(prop.provider)) {
                        this.container.register(prop.provider);
                    }
                    if (isClass(prop.type) && !this.container.has(prop.type)) {
                        this.container.register(prop.type);
                    }

                    if (!ctx.targetReflect.propProviders.has(key)) {
                        ctx.targetReflect.propProviders.set(key, this.container.getToken(prop.provider || prop.type, prop.alias));
                    }
                });
            });
        });
        next();
    }
}

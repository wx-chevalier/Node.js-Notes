import { Singleton } from '../decorators';
import { IocRegisterAction } from './IocRegisterAction';
import { RegisterActionContext } from './RegisterActionContext';
import { ITypeReflect, MetadataService } from '../services';
import { hasOwnClassMetadata } from '../factories';
import { isNumber, isClass } from '../utils';

/**
 * init class reflect action.
 *
 * @export
 * @class InitReflectAction
 * @extends {IocRegisterAction}
 */
export class InitReflectAction extends IocRegisterAction<RegisterActionContext> {

    execute(ctx: RegisterActionContext, next?: () => void): void {
        if (!isClass(ctx.targetType)) {
            return;
        }
        if (!ctx.targetReflect && ctx.targetType) {
            let typeRefs = this.container.getTypeReflects();
            let metaSer = this.container.get(MetadataService);
            if (!typeRefs.has(ctx.targetType)) {
                let targetReflect: ITypeReflect = {
                    type: ctx.targetType,
                    classDecors: metaSer.getClassDecorators(ctx.targetType).reduce((obj, dec) => {
                        obj[dec] = false;
                        return obj;
                    }, {}),
                    propsDecors: metaSer.getPropertyDecorators(ctx.targetType).reduce((obj, dec) => {
                        obj[dec] = false;
                        return obj;
                    }, {}),
                    methodDecors: metaSer.getMethodDecorators(ctx.targetType).reduce((obj, dec) => {
                        obj[dec] = false;
                        return obj;
                    }, {}),
                    propProviders: new Map(),
                    methodParams: new Map(),
                    methodParamProviders: new Map(),
                    provides: []
                };

                let singleton = hasOwnClassMetadata(Singleton, ctx.targetType);
                if (!singleton) {
                    metaSer.eachClassMetadata(ctx.targetType, (meta, decor) => {
                        if (meta) {
                            return true;
                        }
                        if (!singleton) {
                            singleton = meta.singleton;
                        }
                        if (isNumber(meta.expires) && meta.expires > 0) {
                            targetReflect.expires = meta.expires;
                        }
                        return !singleton;
                    });
                }
                targetReflect.singleton = singleton;
                typeRefs.set(ctx.targetType, targetReflect);
                ctx.targetReflect = targetReflect;
            } else {
                ctx.targetReflect = typeRefs.get(ctx.targetType);
            }
        }
        if (next) {
            return next();
        }
    }
}

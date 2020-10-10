import { isClass, isArray, isToken, lang } from '../../utils';
import { getParamMetadata } from '../../factories';
import { ParameterMetadata } from '../../metadatas';
import { RuntimeActionContext } from './RuntimeActionContext';
import { IParameter } from '../../IParameter';
import { BindDeignParamTypeAction } from './BindDeignParamTypeAction';
import { MetadataService } from '../../services';

/**
 * bind parameter type action.
 *
 * @export
 * @class BindParameterTypeAction
 * @extends {ActionComposite}
 */
export class BindParameterTypeAction extends BindDeignParamTypeAction {

    execute(ctx: RuntimeActionContext, next: () => void) {
        let propertyKey = ctx.propertyKey || 'constructor';

        let target = ctx.target
        let type = ctx.targetType;


        let designParams: IParameter[];

        if (ctx.targetReflect.methodParams.has(propertyKey)) {
            designParams = ctx.targetReflect.methodParams.get(propertyKey);
        } else {
            designParams = this.createDesignParams(type, target, propertyKey);
        }

        let parameters = (target || propertyKey !== 'constructor') ? getParamMetadata<ParameterMetadata>(ctx.currDecoractor, target, propertyKey) : getParamMetadata<ParameterMetadata>(ctx.currDecoractor, type);
        if (isArray(parameters) && parameters.length) {
            parameters.forEach(params => {
                let parm = (isArray(params) && params.length > 0) ? params[0] : null;
                if (parm && parm.index >= 0) {
                    if (isClass(parm.provider)) {
                        if (!this.container.has(parm.provider)) {
                            this.container.register(parm.provider);
                        }
                    }
                    if (isClass(parm.type)) {
                        if (!this.container.has(parm.type)) {
                            this.container.register(parm.type);
                        }
                    }
                    if (isToken(parm.provider)) {
                        designParams[parm.index].provider = this.container.getTokenKey(parm.provider, parm.alias);
                    }
                }
            });
        }

        if (propertyKey === 'constructor') {
            if (designParams.some(pa => !pa.type && !pa.provider)) {
                lang.forInClassChain(ctx.targetType, ty => {
                    if (ty === ctx.targetType) {
                        return true;
                    }

                    let parameters = getParamMetadata<ParameterMetadata>(ctx.currDecoractor, ty);
                    if (parameters.length < 1) {
                        return true;
                    }

                    let names = this.container.get(MetadataService).getParamerterNames(ty, propertyKey);
                    if (names.length < 1) {
                        return true;
                    }

                    parameters.map((params, idx) => {
                        let parm = (isArray(params) && params.length > 0) ? params[0] : null;
                        let n = (parm && names.length > parm.index) ? names[parm.index] : names[idx] || '';
                        if (!parm) {
                            return { name: n };
                        }
                        return {
                            name: n,
                            provider: this.container.getTokenKey(parm.provider, parm.alias)
                        }
                    }).forEach(parm => {
                        if (parm.provider) {
                            designParams.forEach(pa => {
                                if (!pa.type && !pa.provider && pa.name === parm.name) {
                                    pa.provider = parm.provider;
                                }
                            });
                        }
                    });
                    return false;
                })
            }
        }

        ctx.targetReflect.methodParams.set(propertyKey, designParams);

        next();
    }
}

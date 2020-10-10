import { IocDesignAction, DesignActionContext, lang, getOwnPropertyMetadata, isClassType, isUndefined, DecoratorProvider } from '@tsdi/ioc';
import { BindingPropertyMetadata } from '../decorators';
import { IBindingTypeReflect } from '../bindings';
import { BindingCache } from './BindingCache';


export class BindingPropertyTypeAction extends IocDesignAction {

    execute(ctx: DesignActionContext, next: () => void) {
        let ref = ctx.targetReflect as IBindingTypeReflect;

        let propBindings = this.container.get(DecoratorProvider)
            .resolve(ctx.currDecoractor, BindingCache)
            .getCache(ref);

        if (propBindings) {
            lang.forInClassChain(ctx.targetType, ty => {
                let propMetas = getOwnPropertyMetadata<BindingPropertyMetadata>(ctx.currDecoractor, ty);
                Object.keys(propMetas).forEach(key => {
                    if (!propBindings.has(key)) {
                        propBindings.set(key, { name: key, type: null });
                    }
                    let binding = propBindings.get(key);
                    let props = propMetas[key];
                    props.forEach(prop => {
                        if (prop.bindingName && !binding.bindingName) {
                            binding.bindingName = prop.bindingName;
                        }

                        if (!binding.type && isClassType(prop.type)) {
                            binding.type = prop.type;
                        }

                        if (!binding.provider) {
                            binding.provider = this.container.getToken(prop.provider || prop.type, prop.alias);
                        }
                        if (prop.bindingType) {
                            binding.bindingType = prop.bindingType;
                        }
                        if (!isUndefined(prop.defaultValue)) {
                            binding.defaultValue = prop.defaultValue;
                        }
                    });
                });
            });
        }
        next();
    }
}

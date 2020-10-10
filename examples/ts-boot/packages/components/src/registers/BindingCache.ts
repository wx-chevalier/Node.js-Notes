import { Abstract } from '@tsdi/ioc';
import { IBinding, IBindingTypeReflect } from '../bindings';

@Abstract()
export abstract class BindingCache {
    abstract getCache(ref: IBindingTypeReflect): Map<string, IBinding>;
}


export class BindingCacheFactory extends BindingCache {

    constructor(private mapGetter: (ref: IBindingTypeReflect) => Map<string, IBinding>) {
        super();
    }

    getCache(ref: IBindingTypeReflect): Map<string, IBinding> {
        if (!ref.paramsBindings) {
            ref.paramsBindings = new Map();
        }
        return this.mapGetter(ref);
    }
}

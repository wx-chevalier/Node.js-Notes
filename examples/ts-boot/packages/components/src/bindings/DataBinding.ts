import { IBinding } from './IPropertyBindingReflect';
import { IContainer } from '@tsdi/core';

/**
 * data binding.
 *
 * @export
 * @abstract
 * @class DataBinding
 * @template T
 */
export abstract class DataBinding<T = any> {

    constructor(protected container: IContainer, public source: any, public prop: string, public binding: IBinding) {
    }

    getScope() {
        return this.source;
    }

    protected getValue(obj, path: string) {
        if (!path) {
            return obj;
        }
        if (!obj) {
            return null;
        }
        let hasNsp = path.indexOf('.') > 1;
        if (hasNsp) {
            let idx = path.indexOf('.');
            let p = path.substring(0, idx);
            if (!p) {
                return obj;
            }
            p = /\?$/.test(p) ? p.substring(0, p.length - 1) : p;
            let pv = obj[p];
            if (!pv) {
                return null;
            }
            return this.getValue(pv, path.substring(idx + 1, path.length).toString());
        } else {
            return obj[path];
        }
    }

    getScopeField(): string {
        return /\./.test(this.prop) ? this.prop.substring(this.prop.lastIndexOf('.') + 1) : this.prop;
    }

    getSourceValue(): T {
        let source = this.getScope();
        if (source) {
            return this.getValue(this.source, this.prop);
        }
        return undefined;
    }

    abstract bind(target: any): void;
}

/**
 * binding
 */
export type Binding<T> = string | DataBinding<T> | T;


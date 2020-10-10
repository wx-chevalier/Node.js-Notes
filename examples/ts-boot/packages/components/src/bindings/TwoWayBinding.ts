import { observe } from './onChange';
import { ParseBinding } from './ParseBinding';
import { isBaseValue, lang } from '@tsdi/ioc';
import { BaseTypeParserToken } from '@tsdi/boot';

export class TwoWayBinding<T> extends ParseBinding<T> {

    bind(target: any, obj?: any): T {
        if (!target) {
            return;
        }

        if (obj) {
            obj[this.binding.name] = target;
        }

        let scopeFiled = this.getScopeField();
        let scope = this.getValue(this.getScope(), /\./.test(this.prop) ? this.prop.substring(0, this.prop.lastIndexOf('.')) : '');

        observe.onPropertyChange(scope, scopeFiled, (obj, prop, value, oldVal) => {
            if (obj === scope && prop === scopeFiled) {
                if (isBaseValue(value)) {
                    let type = this.container.getTokenProvider(this.binding.provider) || this.binding.type;
                    if (type !== lang.getClass(value)) {
                        value = this.container.get(BaseTypeParserToken).parse(type, value);
                    }
                }
                target[this.binding.name] = value;
            }
        });

        observe.onPropertyChange(target, this.binding.name, (obj, prop, value, oldVal) => {
            if (obj === target && prop === this.binding.name) {
                scope[scopeFiled] = value;
            }
        });

        let value = this.getSourceValue();
        target[this.binding.name] = value;

    }
}

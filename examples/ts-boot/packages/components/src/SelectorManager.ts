import { Singleton, InstanceFactory, Type, ProviderTypes, isString, ClassType } from '@tsdi/ioc';

/**
 * selector manager.
 *
 * @export
 * @class SelectorManager
 */
@Singleton()
export class SelectorManager {
    protected factories: Map<string, InstanceFactory>;
    protected selectors: Map<string, Type>;

    constructor() {
        this.factories = new Map();
        this.selectors = new Map();
    }

    has(selector: string | ClassType): boolean {
        if (isString(selector)) {
            return this.selectors.has(selector);
        } else {
            return Array.from(this.selectors.values()).some(it => it === selector);
        }
    }

    set(selector: string, type: Type, factory: InstanceFactory) {
        this.selectors.set(selector, type);
        this.factories.set(selector, factory);
    }

    resolve(selector: string, ...providers: ProviderTypes[]) {
        return this.factories.get(selector)(...providers);
    }

    forEach(func: (type: Type, selector: string) => void) {
        this.selectors.forEach(func);
    }

    get(selector: string): Type {
        return this.selectors.get(selector);
    }

    hasAttr(name: string) {
        return this.has(this.getAttrName(name));
    }

    getAttr(name: string): Type {
        return this.get(this.getAttrName(name));
    }

    getAttrName(name: string): string {
        return /^\[\w*\]$/.test(name) ? name : `[${name}]`
    }
}

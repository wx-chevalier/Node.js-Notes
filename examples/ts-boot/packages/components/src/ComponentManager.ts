import { Singleton, Express, isFunction, isBoolean, isArray, Abstract, OnDestroy } from '@tsdi/ioc';
import { ModuleConfigure } from '@tsdi/boot';

/**
 * component manager.
 *
 * @export
 * @class ComponentManager
 */
@Singleton
export class ComponentManager {

    protected composites: WeakMap<any, any>;
    protected scopes: WeakMap<any, any>;
    protected annoations: WeakMap<any, ModuleConfigure>;

    constructor() {
        this.composites = new WeakMap();
        this.scopes = new WeakMap();
        this.annoations = new WeakMap();
    }

    hasScope(component: any): boolean {
        return this.scopes.has(component);
    }

    getRoot(component: any) {
        if (this.scopes.has(component)) {
            return this.forIn(component, this.scopes);
        }
        return null;
    }

    getScope(component: any) {
        return this.scopes.has(component) ? this.scopes.get(component) : null;
    }

    getScopes(component: any) {
        let scopes = [];
        if (component) {
            this.forIn(component, this.scopes, com => {
                scopes.push(com);
            });
        }
        return scopes;
    }

    getLeaf(component: any): any {
        if (this.composites.has(component)) {
            return this.forIn(component, this.composites);
        }
        return null;
    }

    hasComposite(component: any): boolean {
        return this.composites.has(component);
    }

    setComposite(component: any, composite: any): any[] {
        if (component === composite) {
            return;
        }
        this.scopes.set(composite, component);
        this.composites.set(component, composite);
    }

    getComposite(component: any): any {
        return this.composites.has(component) ? this.composites.get(component) : null;
    }

    setAnnoation(component: any, annoation: ModuleConfigure) {
        this.annoations.set(component, annoation);
    }

    getAnnoation(component: any) {
        return this.annoations.has(component) ? this.annoations.get(component) : null;
    }

    protected forIn(component: any, map: WeakMap<any, any>, action?: (component: any) => void) {
        component = this.composites.get(component);
        while (map.has(component)) {
            component = map.get(component);
            action && action(component);
        }
        return component;
    }

    getSelector(component: any): NodeSelector {
        if (this.hasComposite(component)) {
            return new ComponentSelector(this, component);
        }
        return new NullSelector(component);
    }

    destory(component: any) {
        this.getSelector(component)
            .each((node: OnDestroy) => {
                try {
                    if (node && isFunction(node.onDestroy)) {
                        node.onDestroy();
                    }
                    this.composites.delete(node);
                } catch (err) {
                    console.log(err);
                }
            }, Mode.traverseLast);
    }

    clear() {
        this.composites = new WeakMap();
        this.scopes = new WeakMap();
        this.annoations = new WeakMap();
    }
}


/**
 * iterate way.
 *
 * @export
 * @enum {number}
 */
export enum Mode {
    /**
     * route up. iterate in parents.
     */
    route = 1,
    /**
     * iterate in children.
     */
    children,
    /**
     * iterate as tree map. node first
     */
    traverse,

    /**
     * iterate as tree map. node last
     */
    traverseLast,

}

/**
 * node selector.
 *
 * @export
 * @abstract
 * @class NodeSelector
 * @template T
 */
@Abstract()
export abstract class NodeSelector<T = any> {
    constructor(protected node: T) {

    }

    find<Tc extends T>(express: Tc | Express<Tc, boolean>, mode?: Mode): Tc {
        let component: Tc;
        this.each<Tc>(item => {
            if (component) {
                return false;
            }
            let isFinded = isFunction(express) ? express(item) : item === express;
            if (isFinded) {
                component = item;
                return false;
            }
            return true;
        }, mode);
        return component as Tc;
    }

    filter<Tc extends T>(express: Express<Tc, boolean | void>, mode?: Mode): Tc[] {
        let nodes: T[] = [];
        this.each<Tc>(item => {
            if (express(item)) {
                nodes.push(item);
            }
        }, mode);
        return nodes as Tc[];
    }

    map<Tc extends T, TR>(express: Express<Tc, TR | boolean>, mode?: Mode): TR[] {
        let nodes: TR[] = [];
        this.each<Tc>(item => {
            let r = express(item)
            if (isBoolean(r)) {
                return r;
            } else if (r) {
                nodes.push(r);
            }
        }, mode);
        return nodes;
    }

    each<Tc extends T>(express: Express<Tc, boolean | void>, mode?: Mode) {
        mode = mode || Mode.traverse;
        let r;
        switch (mode) {
            case Mode.route:
                r = this.routeUp(this.node, express);
                break;
            case Mode.children:
                r = this.eachChildren(this.node, express);
                break;
            case Mode.traverseLast:
                r = this.transAfter(this.node, express);
                break;

            case Mode.traverse:
            default:
                r = this.trans(this.node, express);
                break;
        }
        return r;
    }


    protected eachChildren<Tc extends T>(node: T, express: Express<Tc, void | boolean>) {
        this.getChildren(node).some(item => {
            return express(item as Tc) === false;
        });
    }

    /**
     *do express work in routing.
     *
     *@param {Express<T, void | boolean>} express
     *
     *@memberOf IComponent
     */
    routeUp(node: T, express: Express<T, void | boolean>) {
        if (express(node) === false) {
            return false;
        }
        let parentNode = this.getParent(node);
        if (parentNode) {
            return this.routeUp(parentNode, express);
        }
    }

    /**
     *translate all sub context to do express work.
     *
     *@param {Express<IComponent, void | boolean>} express
     *
     *@memberOf IComponent
     */
    trans(node: T, express: Express<T, void | boolean>) {
        if (express(node) === false) {
            return false;
        }
        let children = this.getChildren(node);
        for (let i = 0; i < children.length; i++) {
            let result = this.trans(children[i], express);
            if (result === false) {
                return result;
            }
        }
        return true;
    }

    transAfter(node: T, express: Express<T, void | boolean>) {
        let children = this.getChildren(node);
        for (let i = 0; i < children.length; i++) {
            let result = this.transAfter(children[i], express);
            if (result === false) {
                return false;
            }
        }

        if (express(node) === false) {
            return false;
        }
        return true;
    }

    protected abstract getParent(node: T): T;

    protected abstract getChildren(node: T): T[];
}

/**
 * Component node selector.
 *
 * @export
 * @class CompositeSelector
 */
export class ComponentSelector<T = any> extends NodeSelector<T> {

    constructor(private mgr: ComponentManager, node: T) {
        super(node)
    }

    protected getParent(node: T): T {
        return this.mgr.getScope(node);
    }

    protected getChildren(node: T): T[] {
        let child = this.mgr.getComposite(node);
        if (!child) {
            return [];
        }
        return isArray(child) ? child : [child];
    }
}

export class NullSelector<T = any> extends NodeSelector<T> {
    protected getParent(node: T): T {
        return null
    }

    protected getChildren(node: T): T[] {
        return [];
    }
}


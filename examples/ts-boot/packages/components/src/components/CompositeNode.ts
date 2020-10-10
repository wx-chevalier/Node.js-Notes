import { isString } from '@tsdi/ioc';
import { NodeSelector } from '../ComponentManager';



/**
 * composite for component layout.
 *
 * @export
 * @class Composite
 * @template T
 */
export class CompositeNode {

    parentNode: CompositeNode;
    children: CompositeNode[];

    constructor(public selector?: string) {
        this.children = [];
    }

    add(...nodes: CompositeNode[]): this {
        nodes.forEach(node => {
            node.parentNode = this;
            this.children.push(node);
        });
        return this;
    }

    remove(...nodes: (string | CompositeNode)[]): this {
        let components: CompositeNode[];
        if (nodes.length) {
            components = this.getSelector().filter(cmp => nodes.some(node => isString(node) ? cmp.selector === node : cmp.equals(node)));
        } else {
            components = [this];
        }
        components.forEach(component => {
            if (!component.parentNode) {
                return this;
            } else if (this.equals(component.parentNode)) {
                this.children.splice(this.children.indexOf(component), 1);
                component.parentNode = null;
            } else {
                component.parentNode.remove(component);
            }
        });
        return this;
    }

    equals(node: CompositeNode, node2?: CompositeNode): boolean {
        return node === (node2 || this);
    }

    getSelector(): CompositeSelector {
        return new CompositeSelector(this);
    }

}

/**
 * composite node selector.
 *
 * @export
 * @class CompositeSelector
 */
export class CompositeSelector extends NodeSelector<CompositeNode> {
    protected getParent(node: CompositeNode): CompositeNode {
        return node.parentNode;
    }

    protected getChildren(node: CompositeNode): CompositeNode[] {
        return node.children || [];
    }
}


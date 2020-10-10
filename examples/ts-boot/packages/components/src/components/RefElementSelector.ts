import { RefSelector } from '../RefSelector';
import { Injectable } from '@tsdi/ioc';
import { CompositeNode } from './CompositeNode';


@Injectable()
export class RefElementSelector extends RefSelector {
    select(element: any, selector: string): any {
        if (element instanceof CompositeNode) {
            return element.getSelector()
                .find(e => e.selector === selector)
        }
        if (element.selector === selector) {
            return element;
        }
        return null;
    }
}

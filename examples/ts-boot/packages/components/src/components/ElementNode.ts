import { Component, Input } from '../decorators';
import { CompositeNode } from './CompositeNode';

@Component()
export class ElementNode extends CompositeNode  {
    $scope: any;
    @Input() id: string;
    @Input() selector: string;
    @Input() name: string;
}

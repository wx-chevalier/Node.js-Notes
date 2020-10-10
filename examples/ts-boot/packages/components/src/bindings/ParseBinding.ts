import { DataBinding } from './DataBinding';

/**
 * parse binding
 *
 * @export
 * @class OneWayBinding
 * @extends {DataBinding<T>}
 * @template T
 */
export abstract class ParseBinding<T> extends DataBinding<T> {
    abstract bind(target: any, obj?: any): void;
}

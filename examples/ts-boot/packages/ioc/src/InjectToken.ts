import { Registration } from './Registration';

/**
 * inject token.
 *
 * @export
 * @class InjectToken
 * @extends {Registration<T>}
 * @template T
 */
export class InjectToken<T> extends Registration<T> {
    constructor(desc: string | symbol) {
        super(desc, '');
    }
}

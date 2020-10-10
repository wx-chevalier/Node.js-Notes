import { InjectToken, Singleton } from '@tsdi/ioc';

/**
 * uuid factory.
 *
 * @export
 * @interface UUIDFactory
 */
export interface UUIDFactory {
    /**
     * generate uuid.
     *
     * @returns {string}
     * @memberof UUID
     */
    generate(): string;
}

/**
 * uuid factory token.
 */
export const UUIDToken = new InjectToken<UUIDFactory>('uuid_factory');

/**
 * random uuid factory.
 *
 * @export
 * @class RandomUUIDFactory
 * @implements {UUIDFactory}
 */
@Singleton(UUIDToken)
export class RandomUUIDFactory implements UUIDFactory {
    constructor() {

    }
    /**
     * generate uuid.
     *
     * @returns {string}
     * @memberof RandomUUID
     */
    generate(): string {
        return (this.randomS4() + this.randomS4() + '-' + this.randomS4() + '-' + this.randomS4() + '-' + this.randomS4() + '-' + this.randomS4() + this.randomS4() + this.randomS4());
    }

    protected randomS4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
}

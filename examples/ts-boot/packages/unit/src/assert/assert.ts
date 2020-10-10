import { InjectToken, Abstract, Type } from '@tsdi/ioc';

/**
 * assertion error options.
 *
 * @export
 * @interface IAssertionOptions
 */
export interface IAssertionOptions {
    message?: string;
    actual?: any;
    expected?: any;
    operator?: string;
    stackStartFn?: Function;
    stackStartFunction?: Function;
}

/**
 * Assertion Error interface.
 *
 * @export
 * @interface IAssertionError
 * @extends {Error}
 */
export interface IAssertionError extends Error {
    name: string;
    message: string;
    actual: any;
    expected: any;
    operator: string;
    generatedMessage: boolean;
}


export const RunCaseToken = new InjectToken<Function>('runCase');
export const RunSuiteToken = new InjectToken('runSuite');

/**
 * abstract Assert class.
 *
 * @export
 * @abstract
 * @class Assert
 */
@Abstract()
export abstract class Assert {
    AssertionError: Type<IAssertionError>;
    abstract fail(message: string): never;
    /** @deprecated since v10.0.0 */
    abstract fail(actual: any, expected: any, message?: string, operator?: string): never;
    abstract ok(value: any, message?: string): void;
    /** @deprecated use strictEqual() */
    abstract equal(actual: any, expected: any, message?: string): void;
    /** @deprecated use notStrictEqual() */
    abstract notEqual(actual: any, expected: any, message?: string): void;
    /** @deprecated use deepStrictEqual() */
    abstract deepEqual(actual: any, expected: any, message?: string): void;
    /** @deprecated use notDeepStrictEqual() */
    abstract notDeepEqual(acutal: any, expected: any, message?: string): void;
    abstract strictEqual(actual: any, expected: any, message?: string): void;
    abstract notStrictEqual(actual: any, expected: any, message?: string): void;
    abstract deepStrictEqual(actual: any, expected: any, message?: string): void;
    abstract notDeepStrictEqual(actual: any, expected: any, message?: string): void;

    abstract throws(block: Function, message?: string): void;
    abstract throws(block: Function, error: Function, message?: string): void;
    abstract throws(block: Function, error: RegExp, message?: string): void;
    abstract throws(block: Function, error: (err: any) => boolean, message?: string): void;

    abstract doesNotThrow(block: Function, message?: string): void;
    abstract doesNotThrow(block: Function, error: Function, message?: string): void;
    abstract doesNotThrow(block: Function, error: RegExp, message?: string): void;
    abstract doesNotThrow(block: Function, error: (err: any) => boolean, message?: string): void;

    abstract ifError(value: any): void;

    abstract rejects(block: Function | Promise<any>, message?: string): Promise<void>;
    abstract rejects(block: Function | Promise<any>, error: Function | RegExp | Object | Error, message?: string): Promise<void>;
    abstract doesNotReject(block: Function | Promise<any>, message?: string): Promise<void>;
    abstract doesNotReject(block: Function | Promise<any>, error: Function | RegExp | Object | Error, message?: string): Promise<void>;
}

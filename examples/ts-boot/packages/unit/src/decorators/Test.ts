import { MetadataExtends, MetadataAdapter, isString, isNumber, createMethodDecorator } from '@tsdi/ioc';
import { TestMetadata, TestCaseMetadata } from '../metadata/TestMetadata';


/**
 * define the method of class as unit test case.
 *
 * @export
 * @interface ITestDecorator
 * @template T
 */
export interface ITestDecorator<T extends TestMetadata> {
    (timeout: number): MethodDecorator;
    (metadata?: T): MethodDecorator;
}


/**
 * create Test decorator.
 *
 * @export
 * @template T
 * @param {string} [TestType]
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metaExtends]
 * @returns {ITestDecorator<T>}
 */
export function createTestDecorator<T extends TestMetadata>(
    name: string,
    adapter?: MetadataAdapter,
    finallyAdapter?: MetadataAdapter,
    metaExtends?: MetadataExtends<T>): ITestDecorator<T> {
    return createMethodDecorator<TestMetadata>(name,
        args => {
            if (adapter) {
                adapter(args);
            }

            args.next<TestCaseMetadata>({
                match: (arg) => isNumber(arg),
                setMetadata: (metadata, arg) => {
                    metadata.timeout = arg;
                }
            });

            if (finallyAdapter) {
                finallyAdapter(args);
            }
        }, metaExtends) as ITestDecorator<T>;
}

/**
 * test case decorator
 *
 * @export
 * @interface ITestCaseDecorator
 * @extends {ITestDecorator<TestCaseMetadata>}
 */
export interface ITestCaseDecorator extends ITestDecorator<TestCaseMetadata> {
    /**
     * @Test decorator. define the method of class as unit test case.  Describe a specification or test-case with the given `title` and callback `fn` acting
     * as a thunk.
     *
     * @param {string} title test case title.
     * @param {number} [timeout] test case timeout.
     * @param {number} [setp] test case setp order in this test suite.
     */
    (title?: string, timeout?: number, setp?: number): MethodDecorator;
}

/**
 * @Test decorator. define the method of class as unit test case.  Describe a specification or test-case with the given `title` and callback `fn` acting
 * as a thunk.
 *
 * @export
 * @interface ITestDecorator
 * @template T
 */
export const Test: ITestCaseDecorator = createTestDecorator<TestCaseMetadata>('TestCase',
    args => {
        args.next<TestCaseMetadata>({
            match: (arg) => isString(arg),
            setMetadata: (metadata, arg) => {
                metadata.title = arg;
            }
        });

    },
    args => {
        args.next<TestCaseMetadata>({
            match: (arg) => isNumber(arg),
            setMetadata: (metadata, arg) => {
                metadata.setp = arg;
            }
        });
    }) as ITestCaseDecorator;


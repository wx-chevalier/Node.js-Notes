import { ITestDecorator, createTestDecorator } from './Test';
import { TestMetadata } from '../metadata/TestMetadata';

/**
 * @Before decorator. define the method of class as unit test action run before all test case.
 *
 * @export
 * @interface IBeforeTestDecorator
 * @extends {ITestDecorator<TestMetadata>}
 */
export interface IBeforeTestDecorator extends ITestDecorator<TestMetadata> {

}

/**
 * @Before decorator. define the method of class as unit test action run before all test case.
 *
 * @export
 * @interface IBeforeTestDecorator
 * @template T
 */
export const Before: IBeforeTestDecorator = createTestDecorator<TestMetadata>('TestBefore') as IBeforeTestDecorator;

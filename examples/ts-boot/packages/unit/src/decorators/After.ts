import { ITestDecorator, createTestDecorator } from './Test';
import { TestMetadata } from '../metadata/TestMetadata';

/**
 * @After decorator. define the method of class as unit test action run after all test case.
 *
 * @export
 * @interface IAfterTestDecorator
 * @extends {ITestDecorator<TestMetadata>}
 */
export interface IAfterTestDecorator extends ITestDecorator<TestMetadata> {

}

/**
 * @After decorator. define the method of class as unit test action run after all test case.
 *
 * @export
 * @interface IAfterTestDecorator
 * @template T
 */
export const After: IAfterTestDecorator = createTestDecorator<TestMetadata>('TestAfter') as IAfterTestDecorator;

import { ITestDecorator, createTestDecorator } from './Test';
import { TestMetadata } from '../metadata/TestMetadata';

/**
 * @AfterEach decorator. define the method of class as unit test action run after each test case.
 *
 * @export
 * @interface IAfterEachTestDecorator
 * @extends {ITestDecorator<TestMetadata>}
 */
export interface IAfterEachTestDecorator extends ITestDecorator<TestMetadata> {

}

/**
 * @AfterEach decorator. define the method of class as unit test action run after each test case.
 *
 * @export
 * @interface IAfterEachTestDecorator
 * @template T
 */
export const AfterEach: IAfterEachTestDecorator = createTestDecorator<TestMetadata>('TestAfterEach') as IAfterEachTestDecorator;

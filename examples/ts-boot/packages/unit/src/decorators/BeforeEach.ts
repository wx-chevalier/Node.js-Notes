import { ITestDecorator, createTestDecorator } from './Test';
import { TestMetadata } from '../metadata/TestMetadata';

/**
 * @BeforeEach decorator. define the method of class as unit test action run before each test case.
 *
 * @export
 * @interface IBeforeEachTestDecorator
 * @extends {ITestDecorator<TestMetadata>}
 */
export interface IBeforeEachTestDecorator extends ITestDecorator<TestMetadata> {

}

/**
 * @BeforeEach decorator. define the method of class as unit test action run before each test case.
 *
 * @export
 * @interface IBeforeEachTestDecorator
 * @template T
 */
export const BeforeEach: IBeforeEachTestDecorator = createTestDecorator<TestMetadata>('TestBeforeEach') as IBeforeEachTestDecorator;

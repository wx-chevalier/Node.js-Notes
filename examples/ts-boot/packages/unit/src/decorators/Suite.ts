import {
    MetadataAdapter, MetadataExtends, createClassDecorator,
    isString, ITypeDecorator, isNumber
} from '@tsdi/ioc';
import { SuiteMetadata } from '../metadata/SuiteMetadata';
import { SuiteRunnerToken } from '../runner/ISuiteRunner';


/**
 * Suite decorator type define.
 *
 * @export
 * @interface ISuiteDecorator
 * @template T
 */
export interface ISuiteDecorator<T extends SuiteMetadata> extends ITypeDecorator<T> {
    /**
     * suite decorator.
     * @param {string} suite describe.
     */
    (describe?: string): ClassDecorator;
    /**
     * suite decorator.
     * @param {string} suite describe.
     * @param {number} timeout suite timeout.
     */
    (describe: string, timeout: number): ClassDecorator;
}

/**
 * create filed decorator.
 *
 * @export
 * @template T
 * @param {string} [SuiteType]
 * @param {MetadataAdapter} [adapter]
 * @param {MetadataExtends<T>} [metaExtends]
 * @returns {IFiledDecorator<T>}
 */
export function createSuiteDecorator<T extends SuiteMetadata>(
    adapter?: MetadataAdapter,
    metaExtends?: MetadataExtends<T>): ISuiteDecorator<T> {
    return createClassDecorator<SuiteMetadata>('Suite',
        args => {
            if (adapter) {
                adapter(args);
            }
            args.next<SuiteMetadata>({
                match: (arg) => isString(arg),
                setMetadata: (metadata, arg) => {
                    metadata.describe = arg;
                }
            });
            args.next<SuiteMetadata>({
                match: (arg) => isNumber(arg),
                setMetadata: (metadata, arg) => {
                    metadata.timeout = arg;
                }
            });
        },
        (metadata: T) => {
            if (metaExtends) {
                metaExtends(metadata);
            }
            metadata.singleton = true;
            metadata.defaultRunnable = SuiteRunnerToken;
            return metadata;
        }) as ISuiteDecorator<T>;
}

export const Suite: ISuiteDecorator<SuiteMetadata> = createSuiteDecorator<SuiteMetadata>();

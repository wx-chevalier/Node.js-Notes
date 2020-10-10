import { IocAction } from './Action';
import { ResolveActionContext } from './ResolveActionContext';

/**
 * ioc Resolve action.
 *
 * the Resolve type class can only Resolve in ioc as:
 * ` container.ResolveSingleton(SubResolveAction, () => new SubResolveAction(container));`
 * @export
 * @abstract
 * @class IocResolveAction
 * @extends {IocAction<T>}
 * @template T
 */
export abstract class IocResolveAction<T extends ResolveActionContext = ResolveActionContext> extends IocAction<T> {

}

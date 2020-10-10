import { IocAction } from './Action';
import { RegisterActionContext } from './RegisterActionContext';

/**
 * ioc register action.
 *
 * the register type class can only register in ioc as:
 * ` container.registerSingleton(SubRegisterAction, () => new SubRegisterAction(container));`
 * @export
 * @abstract
 * @class IocRegisterAction
 * @extends {IocAction<T>}
 * @template T
 */
export abstract class IocRegisterAction<T extends RegisterActionContext> extends IocAction<T> {

}

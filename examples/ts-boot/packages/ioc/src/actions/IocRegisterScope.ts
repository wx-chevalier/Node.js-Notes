import { RegisterActionContext } from './RegisterActionContext';
import { ActionScope } from './ActionScope';


/**
 * register action scope.
 *  the register type class can only register in ioc as:
 * ` container.registerSingleton(SubRegisterAction, () => new SubRegisterAction(container));`
 *
 * @export
 * @abstract
 * @class IocRegisterScope
 * @extends {ActionScope<T>}
 * @template T
 */
export abstract class IocRegisterScope<T extends RegisterActionContext = RegisterActionContext> extends ActionScope<T> {

}

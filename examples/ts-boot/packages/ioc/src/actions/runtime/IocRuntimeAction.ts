import { RuntimeActionContext } from './RuntimeActionContext';
import { IocRegisterAction } from '../IocRegisterAction';

/**
 * ioc runtime register action.
 * the register type class can only register in ioc as:
 * ` container.registerSingleton(SubRuntimRegisterAction, () => new SubRuntimRegisterAction(container));`
 * @export
 * @abstract
 * @class IocRegisterAction
 * @extends {IocRegisterAction<RuntimeActionContext>}
 */
export abstract class IocRuntimeAction extends IocRegisterAction<RuntimeActionContext> {

}


import { DesignActionContext } from './DesignActionContext';
import { IocRegisterAction } from '../IocRegisterAction';

/**
 * ioc design action.
 * the register type class can only register in ioc as:
 * ` container.registerSingleton(SubDesignRegisterAction, () => new SubDesignRegisterAction(container));`
 * @export
 * @abstract
 * @class IocRegisterAction
 * @extends {IocRegisterAction<DesignActionContext>}
 */
export abstract class IocDesignAction extends IocRegisterAction<DesignActionContext> {

}

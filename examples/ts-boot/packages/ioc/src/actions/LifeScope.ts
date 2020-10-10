import { IocActionContext } from './Action';
import { ActionScope } from './ActionScope';


/**
 * register Type init life scope action.
 *
 * @export
 * @class LifeScope
 * @extends {IocCompositeAction<T>}
 */
export class LifeScope<T extends IocActionContext> extends ActionScope<T> {

}

import { IocCompositeAction, IocAction } from '@tsdi/ioc';
import { InjectorActionContext } from './InjectorActionContext';


export abstract class InjectorAction extends IocAction<InjectorActionContext> {

}


export abstract class InjectorScope extends IocCompositeAction<InjectorActionContext> {
    abstract setup();
}

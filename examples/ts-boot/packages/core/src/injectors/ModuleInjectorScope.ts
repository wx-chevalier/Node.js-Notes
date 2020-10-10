import { InjectorScope } from './InjectorAction';
import { DecoratorInjectorScope } from './DecoratorInjectorScope';
import { TypesRegisterScope } from './TypesRegisterScope';
import { InjectCompleteCheckAction } from './InjectCompleteCheckAction';

export class ModuleInjectorScope extends InjectorScope {

    setup() {
        this.use(DecoratorInjectorScope, true)
            .use(InjectCompleteCheckAction)
            .use(TypesRegisterScope, true);
    }
}

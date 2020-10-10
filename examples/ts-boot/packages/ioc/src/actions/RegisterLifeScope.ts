import { RegisterActionContext } from './RegisterActionContext';
import { IocRegisterScope } from './IocRegisterScope';

export class RegisterLifeScope<T extends RegisterActionContext = RegisterActionContext> extends IocRegisterScope<T> {

    register(ctx: T, next?: () => void) {
        this.execute(ctx, next);
    }

}

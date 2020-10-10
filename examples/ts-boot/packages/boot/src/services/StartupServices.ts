import { Singleton, IocCoreService, Token, Inject, ContainerFactoryToken, ContainerFactory, ProviderTypes, isToken } from '@tsdi/ioc';

/**
 * startup services.
 *
 * @export
 * @class StartupServices
 * @extends {IocCoreService}
 */
@Singleton
export class StartupServices extends IocCoreService {

    startups: Token[];

    @Inject(ContainerFactoryToken)
    protected cfacory: ContainerFactory;

    constructor() {
        super();
        this.startups = [];
    }

    getService<T>(token: Token<T> | ((tk: Token, startups: Token[]) => boolean)): T {
        let tk: Token<T>;
        if (isToken(token)) {
            tk = this.startups.find(tk => tk === token);
        } else {
            tk = this.startups.find(tk => token(tk, this.startups));
        }
        if (!tk) {
            return null;
        }
        return this.cfacory().get(tk);
    }
}

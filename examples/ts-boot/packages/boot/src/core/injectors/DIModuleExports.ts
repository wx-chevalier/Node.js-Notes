import { IocCoreService, Singleton, Token, IResolver, ProviderTypes } from '@tsdi/ioc';
import { IModuleResolver } from '../modules';

@Singleton
export class DIModuleExports extends IocCoreService implements IResolver {

    /**
    * resolvers
    *
    * @protected
    * @type {IModuleResolver[]}
    * @memberof ResolverChain
    */
    protected resolvers: IModuleResolver[];

    constructor() {
        super();
        this.resolvers = [];
    }

    has<T>(key: Token<T>, alias?: string): boolean {
        if (!this.resolvers.length) {
            return false;
        }
        return this.resolvers.some(r => r.has(key, alias));
    }

    resolve<T>(token: Token<T>, ...providers: ProviderTypes[]): T {
        if (!this.resolvers.length) {
            return null;
        }
        let inst: T;
        this.resolvers.some(r => {
            inst = r.resolve(token, ...providers);
            return !!inst;
        });
        return inst || null;
    }


    unregister<T>(token: Token<T>): this {
        this.resolvers.forEach(r => {
            r.unregister(token);
        });
        return this;
    }


    /**
     * get resolvers.
     *
     * @returns {IResolverContainer[]}
     * @memberof DIModuleExports
     */
    getResolvers(): IModuleResolver[] {
        return this.resolvers;
    }

    /**
     * reigister next resolver.
     *
     * @param {IModuleResolver} resolver
     * @param {boolean} [first]
     * @returns {this}
     * @memberof ExportResolvers
     */
    use(resolver: IModuleResolver, first?: boolean): this {
        if (this.hasResolver(resolver)) {
            return this;
        }
        if (first) {
            this.resolvers.unshift(resolver);
        } else {
            this.resolvers.push(resolver);
        }
        return this;
    }

    /**
     * has resolver or not.
     *
     * @param {IModuleResolver} resolver
     * @returns
     * @memberof ResolverChain
     */
    hasResolver(resolver: IModuleResolver): boolean {
        return this.resolvers.indexOf(resolver) >= 0;
    }

}

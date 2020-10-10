import { BootContext, BootOption, ApplicationContextToken } from './BootContext';
import { Type, LoadType, isArray, isString, InjectReference, isClass, MetadataService, getOwnTypeMetadata } from '@tsdi/ioc';
import { ContainerPool } from './core';
import { IContainerBuilder, ContainerBuilder, IModuleLoader, IContainer } from '@tsdi/core';
import { BuilderServiceToken } from './builder';
import { IBootApplication } from './IBootApplication';
import { BootSetup } from './setup';
import { RunnableConfigure } from './annotations';

/**
 * boot application hooks.
 *
 * @export
 * @interface ContextInit
 */
export interface ContextInit<T extends BootContext = BootContext> {
    /**
     * on context init.
     *
     * @param {T} ctx
     * @memberof ContextInit
     */
    onContextInit(ctx: T);
}

export function checkBootArgs(deps?: LoadType[] | LoadType | string, ...args: string[]): { args: string[], deps: LoadType[] } {
    let mdeps: LoadType[] = [];
    if (isString(deps)) {
        args.unshift(deps);
    } else if (deps) {
        mdeps = isArray(deps) ? deps : [deps];
    }
    return {
        args: args,
        deps: mdeps
    }
}
/**
 * boot application.
 *
 * @export
 * @class BootApplication
 */
export class BootApplication<T extends BootContext = BootContext> implements IBootApplication, ContextInit<T> {

    /**
     * application context.
     *
     * @type {T}
     * @memberof BootApplication
     */
    protected context: T;
    /**
     * application module root container.
     *
     * @type {IContainer}
     * @memberof BootApplication
     */
    public container: IContainer;

    protected pools: ContainerPool;

    constructor(public target?: Type | BootOption | T, public deps?: LoadType[], protected baseURL?: string, protected loader?: IModuleLoader) {
        this.onInit(target);
    }

    protected onInit(target: Type | BootOption | T) {
        this.deps = this.deps || [];
        let raiseContainer: IContainer;
        if (target instanceof BootContext) {
            this.context = target;
            if (this.context.hasRaiseContainer()) {
                raiseContainer = this.context.getRaiseContainer();
            }
        } else if (target && !isClass(target) && target.raiseContainer) {
            raiseContainer = target.raiseContainer();
        }

        if (raiseContainer) {
            this.pools = raiseContainer.get(ContainerPool);
            if (this.pools) {
                this.container = this.pools.create(raiseContainer);
            } else {
                this.container = this.getPools().getRoot();
                raiseContainer.iterator((fac, tk) => {
                    if (!this.container.has(tk)) {
                        this.container.bindProvider(tk, fac);
                    }
                });
            }
            if (this.context) {
                this.context.setRaiseContainer(this.container);
            }
        } else {
            this.container = this.getPools().getRoot();
            if (this.context) {
                this.context.setRaiseContainer(this.container);
            }
        }
        if (!this.container.hasRegister(BootContext)) {
            this.container.register(BootContext);
        }

        this.container.bindProvider(BootApplication, this);
        if (!this.container.has(BootSetup)) {
            this.container.register(BootSetup);
        }
    }

    /**
     * get boot application context.
     *
     * @returns {T}
     * @memberof BootApplication
     */
    getContext(): T {
        return this.context;
    }

    onContextInit(ctx: T) {
        this.context = ctx;
        this.bindContextToken(ctx);
    }

    protected bindContextToken(ctx: T) {
        this.container.bindProvider(ApplicationContextToken, ctx);
        // this.container.bindProvider(new InjectReference(BootApplication, ctx.module), this);
    }

    /**
     * run application.
     *
     * @static
     * @template T
     * @param {(Type<T> | BootOption | BootContext)} target
     * @param {(LoadType[] | LoadType | string)} [deps]  application run depdences.
     * @param {...string[]} args
     * @returns {Promise<BootContext>}
     * @memberof BootApplication
     */
    static run<T>(target: Type<T> | BootOption | BootContext, deps?: LoadType[] | LoadType | string, ...args: string[]): Promise<BootContext> {
        let { deps: dep, args: arg } = checkBootArgs(deps, ...args);
        return new BootApplication(target, dep).run(...arg);
    }

    /**
     * run application of module.
     *
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof BootApplication
     */
    async run(...args: string[]): Promise<T> {
        let ctx = await this.container.resolve(BuilderServiceToken).bootApp(this, ...args);
        return ctx as T;
    }

    getPools(): ContainerPool {
        if (!this.pools) {
            this.pools = new ContainerPool(this.createContainerBuilder());
        }
        return this.pools;
    }

    protected getTargetDeps(target: Type | BootOption | T) {
        let dependences = [];
        if (isClass(target)) {
            this.container.get(MetadataService)
                .getClassDecorators(target)
                .forEach(d => {
                    let metas = getOwnTypeMetadata<RunnableConfigure>(d, target);
                    if (metas && metas.length) {
                        metas.filter(m => m && m.deps && m.deps.length > 0)
                            .forEach(m => {
                                dependences.push(...m.deps);
                            });
                    }
                });
        } else if (target.deps) {
            dependences.push(...target.deps);
        }
        return dependences;
    }

    getBootDeps(): LoadType[] {
        return [...this.deps, ...this.getTargetDeps(this.target)];
    }


    protected createContainerBuilder(): IContainerBuilder {
        return new ContainerBuilder(this.loader);
    }

}

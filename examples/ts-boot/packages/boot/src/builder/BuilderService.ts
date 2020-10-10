import { IocCoreService, Type, Inject, Singleton, isClass, Autorun, ProviderTypes, isFunction, isString } from '@tsdi/ioc';
import { BootContext, BootOption, BootTargetToken } from '../BootContext';
import { IContainer, ContainerToken } from '@tsdi/core';
import { BuildHandles, HandleRegisterer, RegFor, ContainerPoolToken } from '../core';
import { IBootApplication } from '../IBootApplication';
import { ModuleBuilderLifeScope } from './ModuleBuilderLifeScope';
import { ResolveMoudleScope, IModuleResolveOption, BuildContext } from './resovers';
import { RunnableBuildLifeScope } from './RunnableBuildLifeScope';
import { BootLifeScope } from './BootLifeScope';
import { IStartup } from '../runnable';
import { IBuilderService, BuilderServiceToken, BootSubAppOption } from './IBuilderService';



/**
 * service run runnable module.
 *
 * @export
 * @class BuilderService
 * @extends {IocCoreService}
 */
@Singleton(BuilderServiceToken)
@Autorun('setup')
export class BuilderService extends IocCoreService implements IBuilderService {

    @Inject(ContainerToken)
    protected container: IContainer;

    setup() {
        this.container.get(HandleRegisterer)
            .register(this.container, ResolveMoudleScope, true)
            .register(this.container, ModuleBuilderLifeScope, true)
            .register(this.container, RunnableBuildLifeScope, true)
            .register(this.container, BootLifeScope, true);
    }

    /**
     * resolve binding module.
     *
     * @template T
     * @param {Type<T>} target
     * @param {IModuleResolveOption} options
     * @param {...ProviderTypes[]} providers
     * @returns {Promise<T>}
     * @memberof BuilderService
     */
    async resolve<T>(target: Type<T>, options: IModuleResolveOption, ...providers: ProviderTypes[]): Promise<T> {
        let reflect = this.container.getTypeReflects().get(target);
        if (reflect) {
            let rctx = await this.resolveModule(ctx => {
                ctx.targetReflect = reflect;
            }, target, options, ...providers);
            return rctx.target;
        } else {
            return this.buildBootTarget({
                module: target,
                providers: providers,
                regFor: RegFor.boot,
                ...options
            })
        }
    }

    protected async resolveModule<T>(contextInit: (ctx: BuildContext) => void, target: Type<T>, options: IModuleResolveOption, ...providers: ProviderTypes[]): Promise<BuildContext> {
        let rctx = BuildContext.parse(target, options);
        if (providers.length) {
            rctx.providers = (rctx.providers || []).concat(providers);
        }
        if (contextInit) {
            contextInit(rctx);
        }
        if (!rctx.hasRaiseContainer()) {
            rctx.setRaiseContainer(this.container)
        }
        await this.container.get(HandleRegisterer)
            .get(ResolveMoudleScope)
            .execute(rctx);
        return rctx;
    }

    /**
     * build module instace.
     *
     * @template T
     * @param {(Type | BootOption | T)} target
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof BuilderService
     */
    async buildTarget<T, Topt extends BootOption = BootOption>(target: Type<T> | Topt | BootContext, ...args: string[]): Promise<T> {
        let ctx = await this.build(target, ...args);
        return ctx.target;
    }

    async buildBootTarget(target: Type | BootOption | BootContext, ...args: string[]): Promise<any> {
        let ctx = await this.build(target, ...args);
        return ctx.getBootTarget();
    }

    build<T extends BootContext = BootContext, Topt extends BootOption = BootOption>(target: Type | Topt | T, ...args: string[]): Promise<T> {
        return this.execLifeScope<T>(null, this.container.get(HandleRegisterer).get(ModuleBuilderLifeScope), target, ...args);
    }

    /**
     * build startup instance.
     *
     * @template T
     * @param {(Type | BootOption | BootContext)} target
     * @param {...string[]} args
     * @returns {Promise<IStartup<T>>}
     * @memberof BuilderService
     */
    async buildStartup<T, Topt extends BootOption = BootOption>(target: Type | Topt | BootContext, ...args: string[]): Promise<IStartup<T>> {
        let ctx = await this.execLifeScope(ctx => ctx.autorun = false, this.container.get(HandleRegisterer).get(RunnableBuildLifeScope), target, ...args);
        return ctx.runnable;
    }

    /**
     * build startup instance.
     *
     * @template T
     * @param {(Type | BootOption | BootContext)} target
     * @param {...string[]} args
     * @returns {Promise<IStartup<T>>}
     * @memberof BuilderService
     */
    buildRunnable<T, Topt extends BootOption = BootOption>(target: Type | Topt | BootContext, ...args: string[]): Promise<IStartup<T>> {
        return this.buildStartup(target, ...args);
    }

    /**
     * run module.
     *
     * @template T
     * @template Topt
     * @param {(Type | Topt | T)} target
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof BuilderService
     */
    run<T extends BootContext = BootContext, Topt extends BootOption = BootOption>(target: Type | Topt | T, ...args: string[]): Promise<T> {
        return this.execLifeScope<T, Topt>(null, this.container.get(HandleRegisterer).get(RunnableBuildLifeScope), target, ...args);
    }


    /**
     * boot application.
     *
     * @template T
     * @param {(Type | BootOption | T)} target
     * @param {(BootSubAppOption<T> | string)} [options]
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof BuilderService
     */
    async boot<T extends BootContext, Topt extends BootOption = BootOption>(target: Type | Topt | T, options?: (ctx: T) => void | BootSubAppOption<T> | string, ...args: string[]): Promise<T> {
        let opt: BootSubAppOption<T>;
        if (isFunction(options)) {
            opt = { contextInit: options };
        } else if (isString(options)) {
            args.unshift(options);
            opt = {};
        } else {
            opt = options || {};
        }
        let ctx = await this.execLifeScope(
            ctx => {
                ctx.setRaiseContainer(this.container.get(ContainerPoolToken).create());
                if (opt.contextInit) {
                    opt.contextInit(ctx as T);
                }
            },
            this.container.get(HandleRegisterer).get(BootLifeScope),
            target,
            ...args);

        if (isFunction(opt.regExports) && ctx.moduleResolver) {
            opt.regExports(ctx as T, this.container);
        }
        return ctx as T;

    }

    /**
     * boot application.
     *
     * @template T
     * @param {(Type | BootOption | T)} target
     * @param {...string[]} args
     * @returns {Promise<T>}
     * @memberof BuilderService
     */
    async bootApp(application: IBootApplication, ...args: string[]): Promise<BootContext> {
        await this.container.load(...application.getBootDeps());
        return await this.execLifeScope(
            (ctx) => {
                ctx.regFor = RegFor.boot;
                if (isFunction(application.onContextInit)) {
                    application.onContextInit(ctx);
                }
            },
            this.container.get(HandleRegisterer).get(BootLifeScope),
            application.target,
            ...args);
    }

    protected async execLifeScope<T extends BootContext = BootContext, Topt extends BootOption = BootOption>(contextInit: (ctx: T) => void, scope: BuildHandles<T>, target: Type | Topt | T, ...args: string[]): Promise<T> {
        let ctx: T;
        if (target instanceof BootContext) {
            ctx = target as T;
        } else {
            let md = isClass(target) ? target : target.module;
            ctx = this.container.getService({ token: BootContext, target: md }, { provide: BootTargetToken, useValue: md }) as T;
            if (!isClass(target)) {
                ctx.setOptions(target);
            }
        }

        ctx.args = args;
        if (contextInit) {
            contextInit(ctx);
        }
        if (!ctx.hasRaiseContainer()) {
            ctx.setRaiseContainer(this.container);
        }
        await scope.execute(ctx);
        return ctx;
    }
}

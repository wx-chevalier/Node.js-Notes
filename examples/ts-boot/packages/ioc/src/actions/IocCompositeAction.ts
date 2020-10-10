import { lang, isBoolean, isClass } from '../utils';
import { IocAction, IocActionType, IocActionContext } from './Action';
import { IIocContainer } from '../IIocContainer';


/**
 * composite action.
 *
 * @export
 * @class IocCompositeAction
 * @extends {IocAction<T>}
 * @template T
 */
export class IocCompositeAction<T extends IocActionContext = IocActionContext> extends IocAction<T> {

    protected actions: IocActionType[];
    protected befores: IocActionType[];
    protected afters: IocActionType[];

    private actionFuncs: lang.IAction[];
    constructor(container?: IIocContainer) {
        super(container);

        this.befores = [];
        this.actions = [];
        this.afters = [];
    }

    has(action: IocActionType) {
        return this.actions.indexOf(action) >= 0;
    }

    /**
     * use action.
     *
     * @param {IocActionType} action
     * @param {boolean} [setup]  register action type or not.
     * @returns {this}
     * @memberof LifeScope
     */
    use(action: IocActionType, setup?: boolean): this {
        if (this.has(action)) {
            return this;
        }
        this.actions.push(action);
        this.registerAction(action, setup);
        this.resetFuncs();
        return this;
    }

    /**
     * use action before
     *
     * @param {IocActionType} action
     * @param {(IocActionType | boolean)} [before]
     * @param {boolean} [setup]
     * @returns {this}
     * @memberof IocCompositeAction
     */
    useBefore(action: IocActionType, before?: IocActionType | boolean, setup?: boolean): this {
        if (this.has(action)) {
            return this;
        }
        if (before && !isBoolean(before)) {
            this.actions.splice(this.actions.indexOf(before), 0, action);
        } else {
            this.actions.unshift(action);
            if (isBoolean(before)) {
                setup = before;
            }
        }
        this.registerAction(action, setup);
        this.resetFuncs();
        return this;
    }

    /**
     * use action after.
     *
     * @param {IocActionType} action
     * @param {(IocActionType | boolean)} [after]
     * @param {boolean} [setup]
     * @returns {this}
     * @memberof IocCompositeAction
     */
    useAfter(action: IocActionType, after?: IocActionType | boolean, setup?: boolean): this {
        if (this.has(action)) {
            return this;
        }
        if (after && !isBoolean(after)) {
            this.actions.splice(this.actions.indexOf(after) + 1, 0, action);
        } else {
            this.actions.push(action);
            if (isBoolean(after)) {
                setup = after;
            }
        }
        this.registerAction(action, setup);
        this.resetFuncs();
        return this;
    }

    /**
     * register actions before run this scope.
     *
     * @param {IocActionType} action
     * @memberof IocCompositeAction
     */
    before(action: IocActionType, setup?: boolean): this {
        if (this.befores.indexOf(action) < 0) {
            this.befores.push(action);
            this.registerAction(action, setup);
            this.resetFuncs();
        }
        return this;
    }

    /**
     * register actions after run this scope.
     *
     * @param {IocActionType} action
     * @memberof IocCompositeAction
     */
    after(action: IocActionType, setup?: boolean): this {
        if (this.afters.indexOf(action) < 0) {
            this.afters.push(action);
            this.registerAction(action, setup);
            this.resetFuncs();
        }
        return this;
    }

    execute(ctx: T, next?: () => void): void {
        if (!this.actionFuncs) {
            this.actionFuncs = [...this.befores, ...this.actions, ...this.afters].map(ac => this.parseAction(ac)).filter(f => f);
        }
        this.execFuncs(ctx, this.actionFuncs, next);
    }

    protected registerAction(action: IocActionType, setup?: boolean): this {
        if (isClass(action)) {
            this.container.getActionRegisterer().register(this.container, action, setup);
        }
        return this;
    }

    protected resetFuncs() {
        this.actionFuncs = null;
    }

    setup() {

    }

}

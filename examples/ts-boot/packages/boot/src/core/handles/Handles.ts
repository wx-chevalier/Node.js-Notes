import { IHandleContext, HandleType, Handle } from './Handle';
import { PromiseUtil, isBoolean } from '@tsdi/ioc';
import { IContainer } from '@tsdi/core';

/**
 * composite handles.
 *
 * @export
 * @class Handles
 * @extends {BuildHandle<T>}
 * @template T
 */
export abstract class Handles<T extends IHandleContext> extends Handle<T> {

    protected handles: HandleType<T>[];
    private funcs: PromiseUtil.ActionHandle<T>[];


    constructor(container?: IContainer) {
        super(container)
        this.handles = [];
    }

    /**
     * use handle.
     *
     * @param {HandleType} handle
     * @param {boolean} [setup]  setup handle type or not.
     * @returns {this}
     * @memberof LifeScope
     */
    use(handle: HandleType<T>, setup?: boolean): this {
        if (!this.has(handle)) {
            this.handles.push(handle);
            this.registerHandle(handle, setup);
            this.resetFuncs();
        }
        return this;
    }

    unuse(handle: HandleType<T>) {
        let idx = this.handles.indexOf(handle);
        if (idx >= 0) {
            this.handles.splice(idx, 1);
            this.resetFuncs();
        }
        return this;
    }

    has(handle: HandleType<T>): boolean {
        return this.handles.indexOf(handle) >= 0;
    }

    /**
     * use handle before
     *
     * @param {HandleType} handle
     * @param {HandleType} before
     * @returns {this}
     * @memberof LifeScope
     */
    useBefore(handle: HandleType<T>, before: HandleType<T> | boolean, setup?: boolean): this {
        if (this.has(handle)) {
            return this;
        }
        if (before && !isBoolean(before)) {
            this.handles.splice(this.handles.indexOf(before), 0, handle);
        } else {
            this.handles.unshift(handle);
            if (isBoolean(before)) {
                setup = before;
            }
        }
        this.registerHandle(handle, setup);
        this.resetFuncs();
        return this;
    }
    /**
     * use handle after.
     *
     * @param {HandleType} handle
     * @param {HandleType} after
     * @returns {this}
     * @memberof LifeScope
     */
    useAfter(handle: HandleType<T>, after?: HandleType<T> | boolean, setup?: boolean): this {
        if (this.has(handle)) {
            return this;
        }
        if (after && !isBoolean(after)) {
            this.handles.splice(this.handles.indexOf(after) + 1, 0, handle);
        } else {
            this.handles.push(handle);
            if (isBoolean(after)) {
                setup = after;
            }
        }
        this.registerHandle(handle, setup);
        this.resetFuncs();
        return this;
    }

    async execute(ctx: T, next?: () => Promise<void>): Promise<void> {
        if (!this.funcs) {
            this.funcs = this.handles.map(ac => this.parseAction(ac)).filter(f => f);
        }
        await this.execFuncs(ctx, this.funcs, next);
    }

    protected resetFuncs() {
        this.funcs = null;
    }

    protected abstract registerHandle(handle: HandleType<T>, setup?: boolean): this;

}

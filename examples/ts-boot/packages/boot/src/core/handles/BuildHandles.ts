import { Handle, HandleType, IHandleContext, IHandle } from './Handle';
import { Type, ActionRegisterer, isClass } from '@tsdi/ioc';
import { Handles } from './Handles';

/**
 * handle registerer.
 *
 * @export
 * @class HandleRegisterer
 * @extends {ActionRegisterer<IHandle>}
 * @template T
 */
export class HandleRegisterer<T extends IHandle = IHandle> extends ActionRegisterer<IHandle> {
    protected setup(handle: T) {
        if (handle instanceof BuildHandles) {
            handle.setup();
        }
    }
}

/**
 * build handle.
 *
 * @export
 * @abstract
 * @class BuildHandle
 * @extends {Handle<T>}
 * @template T
 */
export abstract class BuildHandle<T extends IHandleContext = IHandleContext> extends Handle<T> {
    protected registerHandle(handle: HandleType<T>, setup?: boolean): this {
        if (isClass(handle)) {
            this.container.resolve(HandleRegisterer)
                .register(this.container, handle, setup);
        }
        return this;
    }
}

/**
 * composite handles.
 *
 * @export
 * @class CompositeHandle
 * @extends {BuildHandle<T>}
 * @template T
 */
export class BuildHandles<T extends IHandleContext> extends Handles<T> {

    protected registerHandle(HandleType: HandleType<T>, setup?: boolean): this {
        if (isClass(HandleType)) {
            this.container.resolve(HandleRegisterer)
                .register(this.container, HandleType, setup);
        }
        return this;
    }

    protected resolveHanlde(ac: Type<BuildHandle<T>>): BuildHandle<T> {
        return this.container.resolve(HandleRegisterer).get(ac)
    }

    setup() {
    }
}

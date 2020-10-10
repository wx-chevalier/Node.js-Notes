import { Events, BindEventType } from './Events';
import { lang } from '@tsdi/ioc';

export namespace observe {

    const events = new WeakMap<any, Events>();
    const defines = new WeakMap();

    /**
     * get events of target object.
     *
     * @export
     * @param {*} target
     * @returns {Events}
     */
    export function getEvents(target: any): Events {
        return events.get(target);
    }

    /**
     * target has envents or not.
     *
     * @export
     * @param {*} target
     * @returns {boolean}
     */
    export function hasEvents(target: any): boolean {
        return events.has(target);
    }

    /**
     * on property change.
     *
     * @export
     * @param {*} target
     * @param {string} property
     * @param {(target: any, prop: string, vaule?: any, old?: any) => void} onChange
     * @returns
     */
    export function onPropertyChange(target: any, property: string, onChange: (target: any, prop: string, vaule?: any, old?: any) => void) {
        let evt: Events;
        if (!events.has(target)) {
            evt = new Events();
            events.set(target, evt)
        } else {
            evt = events.get(target);
        }

        if (!defines.has(target) || !defines.get(target)[property]) {
            let descriptors = Object.getOwnPropertyDescriptors(lang.getClass(target).prototype);
            let descriptor = descriptors[property];
            let value = Reflect.get(target, property);
            Reflect.defineProperty(target, property, {
                get() {
                    if (descriptor && descriptor.get) {
                        return descriptor.get.call(target);
                    } else {
                        return value;
                    }
                },
                set(val: any) {
                    let isChanged = value !== val;
                    let old = value;
                    value = val;
                    if (descriptor && descriptor.set) {
                        descriptor.set.call(target, val);
                    }
                    if (isChanged) {
                        evt.emit(BindEventType.fieldChanged, target, property, val, old);
                    }
                }
            });

            let pps = defines.get(target) || {};
            pps[property] = true;
            defines.set(target, pps)
        }

        evt.on(BindEventType.fieldChanged, onChange);

    }
}

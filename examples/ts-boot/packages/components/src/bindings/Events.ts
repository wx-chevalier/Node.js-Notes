import { ObjectMap } from '@tsdi/ioc';

export enum BindEventType {
    fieldChanged = 'fieldChanged'
}

export class Events {
    private maps: ObjectMap<Function[]>;
    constructor() {
        this.maps = {};
    }

    on(event: string, handle: (...args: any[]) => void) {
        this.maps[event] = this.maps[event] || [];
        if (this.maps[event].indexOf(handle) < 0) {
            this.maps[event].push(handle);
        }
    }

    off(event: string, ...handles: Function[]) {
        if (handles.length) {
            if (this.maps[event]) {
                this.maps[event] = this.maps[event].filter(h => handles.indexOf(h) < 0);
            }
        } else {
            delete this.maps[event];
        }
    }

    emit(event: string, ...args: any[]) {
        let hanldes = this.maps[event] || [];
        hanldes.forEach(h => {
            h(...args);
        });
    }

}

// @Singleton
// export class EventManager {
//     protected events: WeakMap<any, Events>;

//     constructor() {
//         this.events = new WeakMap();
//     }

//     get(component: any): Events {
//         if (!this.events.has(component)) {
//             this.events.set(component, new Events());
//         }
//         return this.events.get(component);
//     }

//     has(component: any): boolean {
//         return this.events.has(component);
//     }

//     set(component: any, events: Events): this {
//         this.events.set(component, events);
//         return this;
//     }
// }

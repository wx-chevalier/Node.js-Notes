import { Injectable, lang } from '@tsdi/ioc';
import { Activity } from './Activity';

export interface RunScopes {
    scope: Activity,
    subs: Activity[]
}

/**
 * activity status.
 *
 * @export
 * @class ActivityStatus
 */
@Injectable
export class ActivityStatus {

    // tracks: Activity[];
    scopes: RunScopes[];

    constructor() {
        // this.tracks = [];
        this.scopes = [];
    }


    private _current: Activity;
    /**
     * current actiivty.
     *
     * @type {Activity}
     * @memberof ActivityStateManager
     */
    get current(): Activity {
        return this._current;
    }

    set current(activity: Activity) {
        this._current = activity;
        // this.tracks.unshift(activity);
        if (activity.isScope) {
            this.scopes.unshift({ scope: activity, subs: [] });
        } else if (this.currentScope) {
            this.currentScope.subs.unshift(activity);
        }
    }

    scopeEnd() {
        this.scopes.shift();
    }

    get currentScope(): RunScopes {
        return lang.first(this.scopes);
    }

    get parentScope(): RunScopes {
        if (this.scopes.length > 1) {
            return this.scopes[1];
        }
        return null;
    }
}

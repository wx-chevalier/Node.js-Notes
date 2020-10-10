import { Activity, ActivityContext } from '../core';

export abstract class ControlerActivity<T = any> extends Activity<T> {

    protected setActivityResult(ctx: ActivityContext) {

    }

    protected setContextResult(ctx: ActivityContext) {

    }
}

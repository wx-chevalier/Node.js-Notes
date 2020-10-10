import { BootOption } from '@tsdi/boot';
import { Activity } from './Activity';
import { WorkflowInstance } from './WorkflowInstance';
import { ActivityContext } from './ActivityContext';
import { ActivityTemplate } from './ActivityConfigure';



/**
 * activity option.
 *
 * @export
 * @interface ActivityOption
 * @extends {BootOption}
 */
export interface ActivityOption<T extends ActivityContext = ActivityContext> extends BootOption {
    /**
     * workflow id.
     *
     * @type {string}
     * @memberof ActivityOption
     */
    id?: string;
    /**
     * input data
     *
     * @type {*}
     * @memberof IRunContext
     */
    body?: any;

    /**
     * target module instace.
     *
     * @type {*}
     * @memberof BootContext
     */
    target?: Activity<T>;

    /**
     * bootstrap reference runable service.
     *
     * @type {WorkflowInstance}
     * @memberof BootContext
     */
    runnable?: WorkflowInstance;

    /**
     * activities component template scope.
     *
     * @type {ActivityTemplate}
     * @memberof ActivityConfigure
     */
    template?: ActivityTemplate
}

import { InjectToken, Type, PromiseUtil, Token, ProviderTypes, ObjectMap } from '@tsdi/ioc';
import { RunnableConfigure } from '@tsdi/boot';
import { Activity } from './Activity';
import { ActivityContext } from './ActivityContext';
import { ValuePipe } from './ValuePipe';
import { Binding } from '@tsdi/components';


export const WorkflowId = new InjectToken<string>('Workflow_ID');


/**
 * selectors.
 *
 * @export
 * @enum {number}
 */
export enum Activities {
    if = 'if',
    elseif = 'elseif',
    else = 'else',
    dowhile = 'dowhile',
    while = 'while',
    switch = 'switch',
    throw = 'throw',
    try = 'try',
    catch = 'catch',
    invoke = 'invoke',
    sequence = 'sequence',
    parallel = 'parallel',
    interval = 'interval',
    each = 'each',
    execute = 'execute'
}

/**
 * activity configuration.
 *
 * @export
 * @interface ActivityConfigure
 * @extends {RunnableConfigure}
 * @template T
 */
export interface ActivityConfigure<T extends TemplateOption = ControlTemplate>  extends RunnableConfigure {
    /**
    * action name.
    *
    * @type {string}
    * @memberof ActivityConfigure
    */
    name?: string;
    /**
     * task title.
     *
     * @type {string}
     * @memberof IActivityConfigure
     */
    title?: string;

    /**
     * activities component template scope.
     *
     * @type {ActivityTemplate}
     * @memberof ActivityConfigure
     */
    template?: ActivityTemplate<T>;

    /**
     * decor Type
     *
     * @type {string}
     * @memberof ActivityConfigure
     */
    decorType?: string;

    /**
     * context type.
     *
     * @type {Token<ActivityContext>}
     * @memberof ActivityConfigure
     */
    contextType?: Token<ActivityContext>;
}

/**
 * template option.
 *
 * @export
 * @interface TemplateOption
 * @template T
 */
export interface TemplateOption extends ObjectMap {
    /**
     * activity selector math the template option tag.
     *
     * @type {string}
     * @memberof ConditionOption
     */
    activity: string | Activities | Type;

    /**
     * action name.
     *
     * @type {Expression<string>}
     * @memberof TemplateOption
     */
    name?: Binding<string>;

    /**
     * value pipe.
     *
     * @type {(Type<ValuePipe> | ValuePipe)}
     * @memberof TemplateOption
     */
    pipe?: Type<ValuePipe> | ValuePipe;
}


export interface InvokeTemplate extends TemplateOption {
    target: Binding<Token>,
    method: Binding<string>,
    args: Binding<ProviderTypes[]>
}

export interface ExecuteOption extends TemplateOption {
    action: Binding<(ctx: ActivityContext, activity?: Activity) => void | Promise<void>>;
}


export interface IBodyTemplate {
    body?: Binding<ActivityType | ActivityType[]>;
}

export interface BodyTemplate extends TemplateOption, IBodyTemplate {
}


export interface IExpressionTemplate {
    /**
     * expression
     *
     * @type {Expression<any>}
     * @memberof ExpressionOption
     */
    expression: Binding<any>;
}

/**
 * expression option.
 *
 * @export
 * @interface ExpressionTemplate
 * @extends {ActivityOption}
 */
export interface ExpressionTemplate extends TemplateOption, IExpressionTemplate {
}


export interface IConditionTemplate {
    /**
     * condition
     *
     * @type {Expression<boolean>}
     * @memberof ConditionOption
     */
    condition: Binding<Expression<boolean>>;
}

/**
 * condition option.
 *
 * @export
 * @interface ConditionTemplate
 * @extends {ActivityOption}
 */
export interface ConditionTemplate extends BodyTemplate, IConditionTemplate {
}

export interface EachTeamplate extends BodyTemplate {
    parallel?: Binding<boolean>;
    each: Binding<Expression<any[]>>;
}

/**
 * timer template.
 *
 * @export
 * @interface TimerTemplate
 * @extends {BodyTemplate}
 */
export interface TimerTemplate extends BodyTemplate {
    /**
     * time.
     *
     * @type {Binding<Expression<number>>}
     * @memberof TimerOption
     */
    time: Binding<Expression<number>>;
}



/**
 * throw template.
 *
 * @export
 * @interface ThrowTemplate
 * @extends {TemplateOption}
 */
export interface ThrowTemplate extends TemplateOption {
    throw: Binding<Expression<Error>>;
}

export interface SwitchTemplate extends TemplateOption {
    switch: Binding<Expression<string | number>>;
    cases: Binding<CaseTemplate[]>;
    defaults?: Binding<ActivityType[]>;
}

/**
 * case template.
 */
export interface CaseTemplate extends IBodyTemplate {
    /**
     * case
     *
     * @type {Binding<any>}
     * @memberof CaseTemplate
     */
    case: Binding<any>;
}

export interface CatchTemplate extends IBodyTemplate {
    /**
     * to catch typeof this error.
     *
     * @type {Type<Error>}
     * @memberof CatchTemplate
     */
    error: Binding<Type<Error>>;
}

export interface TryTemplate extends TemplateOption {
    try: Binding<ActivityType[]>;
    catchs?: Binding<CatchTemplate[]>;
    finally?: Binding<ActivityType[]>;
}

export type ControlTemplate =  Required<TemplateOption> | ExecuteOption | ExpressionTemplate | ConditionTemplate | EachTeamplate | InvokeTemplate
    | BodyTemplate | TimerTemplate | ThrowTemplate | SwitchTemplate | TryTemplate;


export type TemplateType<T extends TemplateOption = ControlTemplate> = Type | T | PromiseUtil.ActionHandle<ActivityContext>;

/**
 *  activity type.
 */
export type ActivityType<TVal= any, T extends TemplateOption = ControlTemplate> = Activity<TVal> | Type<Activity<TVal>> | TemplateType<T>;

/**
 * activity template.
 */
export type ActivityTemplate<T extends TemplateOption = ControlTemplate>  = TemplateType<T> | TemplateType<T>[];

/**
 * context expression.
 */
export type CtxExpression<T, TC extends ActivityContext> = T | Promise<T> | Type<Activity<T>> | Activity<T> | ((ctx: TC) => T | Promise<T>) | Type;

/**
 * expression.
 */
export type Expression<T = any> = CtxExpression<T, ActivityContext>;


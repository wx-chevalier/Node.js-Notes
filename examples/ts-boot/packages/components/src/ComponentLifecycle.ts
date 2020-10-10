/**
 * Before component init.
 *
 * @export
 * @interface BeforeInit
 */
export interface BeforeInit {
    /**
     * component before init hooks. after constructor befor property inject.
     *
     * @memberof BeforeInit
     */
    onBeforeInit(): void | Promise<void>;
}

/**
 * on component init.
 *
 * @export
 * @interface OnInit
 */
export interface OnInit {
    /**
     * component on init hooks. after property inject.
     *
     * @memberof OnInit
     */
    onInit(): void | Promise<void>;
}

/**
 * after component init.
 *
 * @export
 * @interface AfterInit
 */
export interface AfterInit {
    /**
     * component after init hooks. after property inject.
     *
     * @memberof AfterInit
     */
    onAfterInit(): void | Promise<void>;
}

/**
 * ater content init hooks.
 *
 * @export
 * @interface AfterContentInit
 */
export interface AfterContentInit {
    /**
     * component after content init hooks. after property inject.
     *
     * @memberof AfterInit
     */
    onAfterContentInit(): void | Promise<void>;
}

/**
 * component destory hooks.
 *
 * @export
 * @interface AfterContentInit
 */
export interface OnDestory {
    /**
     * component destory hooks. invoke on component destory.
     *
     * @memberof AfterInit
     */
    onDestory(): void | Promise<void>;
}

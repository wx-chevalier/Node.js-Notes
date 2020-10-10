/**
 * define register module scope.
 *
 * @export
 * @enum {number}
 */
export enum RegFor {
    /**
     * current boot module
     */
    boot = 1,

    /**
     * regiser as child module
     */
    child,
    /**
     * regiser as root module
     */
    root,
    /**
     * register all container in pools.
     */
    all
}

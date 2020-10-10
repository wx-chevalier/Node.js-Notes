/**
 * decorator type category.
 *
 * @export
 * @enum {number}
 */
export enum DecoratorType {
    /**
     * Class decorator
     */
    Class = 1 << 0,
    /**
     * Parameter decorator
     */
    Parameter = 1 << 1,
    /**
     * Property decorator
     */
    Property = 1 << 2,
    /**
     * Method decorator
     */
    Method = 1 << 3,
    /**
     * decorator for design time class. class, property, method parameter annoation.
     */
    Decorator = Class | Parameter | Property | Method
}

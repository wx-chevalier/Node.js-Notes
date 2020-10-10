import { Type, AbstractType, Token, SymbolType } from './types';
import { isClass, isFunction, lang } from './utils/lang';


/**
 * inject token.
 * @export
 * @class Registration
 * @template T
 */
export class Registration<T = any> {
    protected type = '';
    protected classType: SymbolType;
    protected desc: string;
    /**
     * Creates an instance of Registration.
     * @param {(Token<T> | Token)} provideType
     * @param {string} desc
     * @memberof Registration
     */
    constructor(provideType: Token<T> | Token, desc: string) {
        this.init(provideType, desc);
    }

    protected init(provideType: Token<T> | Token, desc?: string) {
        if (provideType instanceof Registration) {
            if (desc) {
                this.classType = provideType.toString();
                this.desc = desc;
            } else {
                this.classType = provideType.getProvide();
                this.desc = provideType.getDesc();
            }
        } else {
            this.classType = provideType;
            this.desc = desc;
        }
    }

    /**
     * get provide.
     *
     * @returns {SymbolType}
     * @memberof Registration
     */
    getProvide(): SymbolType {
        return this.classType;
    }

    /**
     * get class.
     *
     * @returns
     * @memberof Registration
     */
    getClass(): Type<T> | AbstractType<T> {
        if (isClass(this.classType)) {
            return this.classType;
        }
        return null;
    }

    /**
     * get desc.
     *
     * @returns
     * @memberof Registration
     */
    getDesc() {
        return this.desc;
    }

    /**
     * to string.
     *
     * @returns {string}
     * @memberof Registration
     */
    toString(): string {
        return this.format(this);
    }

    protected format(reg: Token<T>): string {
        if (reg instanceof Registration) {
            let name = '';
            if (isFunction(reg.classType)) {
                name = `{${lang.getClassName(reg.classType)}}`;
            }  else if (reg.classType) {
                name = reg.classType.toString();
            }
            return [reg.type, name, reg.desc].filter(n => n).join('_');
        } else if (isFunction(reg)) {
            return `{${lang.getClassName(reg)}}`;
        } else if (reg) {
            return reg.toString();
        }
        return '';
    }
}


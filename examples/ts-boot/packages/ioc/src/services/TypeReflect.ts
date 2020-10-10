import { Token, ClassType, ObjectMap } from '../types';
import { IocCoreService } from './IocCoreService';
import { IParameter } from '../IParameter';
import { ParamProviders } from '../providers';
import { ClassMetadata } from '../metadatas';



/**
 * type reflect.
 *
 * @export
 * @interface ITypeReflect
 */
export interface ITypeReflect extends ClassMetadata {

    /**
     * main module decorator.
     *
     * @type {string}
     * @memberof ITypeReflect
     */
    decorator?: string;
    /**
     * class decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof ITypeReflect
     */
    classDecors: ObjectMap<boolean>;

    /**
     * props decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    propsDecors: ObjectMap<boolean>;

    /**
     * method decorators annoationed state.
     *
     * @type {ObjectMap<boolean>}
     * @memberof RegisterActionContext
     */
    methodDecors: ObjectMap<boolean>;
    /**
     * props.
     *
     * @type {PropertyMetadata[]}
     * @memberof ITypeReflect
     */
    propProviders: Map<string, Token>;
    /**
     * method params.
     *
     * @type {ObjectMap<IParameter[]>}
     * @memberof ITypeReflect
     */
    methodParams: Map<string, IParameter[]>;

    /**
     * method param providers.
     *
     * @type {ObjectMap<ParamProviders[]>}
     * @memberof ITypeReflect
     */
    methodParamProviders: Map<string, ParamProviders[]>;
    /**
     * this class provides.
     *
     * @type {Token}
     * @memberof ITypeReflect
     */
    provides?: Token[];
}

/**
 * type reflects.
 *
 * @export
 * @class TypeReflects
 * @extends {IocCoreService}
 */
export class TypeReflects extends IocCoreService {
    map: Map<ClassType, ITypeReflect>;
    constructor() {
        super();
        this.map = new Map();
    }

    has(type: ClassType): boolean {
        return this.map.has(type);
    }

    set(type: ClassType, typeInfo: ITypeReflect): this {
        if (!this.map.has(type)) {
            this.map.set(type, typeInfo);
        }
        return this;
    }

    get<T extends ITypeReflect>(type: ClassType): T {
        if (this.map.has(type)) {
            return this.map.get(type) as T;
        }
        return null;
    }

}

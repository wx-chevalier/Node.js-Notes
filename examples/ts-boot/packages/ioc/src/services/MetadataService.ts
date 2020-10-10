import { IocCoreService } from './IocCoreService';
import { ClassType, Express, Type } from '../types';
import {
    getMethodDecorators, getPropDecorators, getParamDecorators,
    getClassDecorators, getTypeMetadata, getOwnMethodMetadata,
    getPropertyMetadata, getParamMetadata, getOwnParamerterNames
} from '../factories';
import { ClassMetadata, MethodMetadata, PropertyMetadata, ParameterMetadata } from '../metadatas';
import { isArray } from '../utils';

/**
 * metadata services.
 *
 * @export
 * @class MetadataService
 * @extends {IocCoreService}
 */
export class MetadataService extends IocCoreService {

    /**
     * get paramerter names.
     *
     * @template T
     * @param {Type<T>} type
     * @param {string} propertyKey
     * @returns {string[]}
     * @memberof LifeScope
     */
    getParamerterNames<T>(type: ClassType<T>, propertyKey: string): string[] {
        let metadata = getOwnParamerterNames(type);
        let paramNames = [];
        if (metadata && metadata.hasOwnProperty(propertyKey)) {
            paramNames = metadata[propertyKey]
        }
        if (!isArray(paramNames)) {
            paramNames = [];
        }
        return paramNames;
    }

    getClassDecorators(target: ClassType): string[] {
        return getClassDecorators(target);
    }

    getMethodDecorators(target: ClassType): string[] {
        return getMethodDecorators(target);
    }

    getPropertyDecorators(target: ClassType): string[] {
        return getPropDecorators(target);
    }

    getParameterDecorators(target: any, propertyKey?: string): string[] {
        propertyKey = propertyKey || 'constructor';
        return getParamDecorators(target, propertyKey);
    }

    /**
     * each class metadata.
     *
     * @param {ClassType} target
     * @param {((meta: ClassMetadata, decor: string) => void | boolean)} express
     * @param {Express<string, boolean>} [decorFilter]
     * @memberof DecoratorRegisterer
     */
    eachClassMetadata(target: ClassType, express: (meta: ClassMetadata, decor: string) => void | boolean, decorFilter?: Express<string, boolean>) {
        let decors = this.getClassDecorators(target);
        if (decorFilter) {
            decors = decors.filter(decorFilter);
        }
        decors.some(decor => {
            let metas = getTypeMetadata<ClassMetadata>(decor, target);
            if (metas && metas.length) {
                return metas.some(meta => {
                    if (meta && express(meta, decor) === false) {
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
    }


    /**
     * each property metadata.
     *
     * @param {ClassType} target
     * @param {((meta: PropertyMetadata, propertyKey?: string, decor?: string) => void | boolean)} express
     * @param {Express<string, boolean>} [decorFilter]
     * @memberof DecoratorRegisterer
     */
    eachPropMetadata(target: ClassType, express: (meta: PropertyMetadata, propertyKey?: string, decor?: string) => void | boolean, decorFilter?: Express<string, boolean>) {
        let decors = this.getClassDecorators(target);
        if (decorFilter) {
            decors = decors.filter(decorFilter);
        }
        decors.some(decor => {
            let metas = getPropertyMetadata<PropertyMetadata>(decor, target);
            if (metas) {
                return Object.keys(metas).some(key => {
                    let pMtas = metas[key];
                    if (pMtas && pMtas.length) {
                        return pMtas.some(meta => {
                            if (meta && express(meta, key, decor) === false) {
                                return true;
                            }
                            return false;
                        });
                    }
                    return false;
                })
            }
            return false;
        });
    }

    /**
     * each method metadata.
     *
     * @param {Type} target
     * @param {string} propertyKey
     * @param {((meta: MethodMetadata, decor: string) => void | boolean)} express
     * @param {Express<string, boolean>} [decorFilter]
     * @returns {MethodMetadata[]}
     * @memberof DecoratorRegisterer
     */
    eachMethodMetadata(target: Type, propertyKey: string, express: (meta: MethodMetadata, decor: string) => void | boolean, decorFilter?: Express<string, boolean>): MethodMetadata[] {
        let decors = this.getMethodDecorators(target);
        if (decorFilter) {
            decors = decors.filter(decorFilter);
        }
        let metas: MethodMetadata[] = [];
        decors.some(decor => {
            let clmetas = getOwnMethodMetadata<MethodMetadata>(decor, target);
            let methodmeta = clmetas[propertyKey];
            if (methodmeta && methodmeta.length) {
                return methodmeta.some(meta => {
                    if (meta && express(meta, decor) === false) {
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
        return metas;
    }

    getMethodMetadatas<T>(target: Type<T>, propertyKey: string, filter?: (meta: MethodMetadata, decor?: string) => boolean): MethodMetadata[] {
        let metadatas = [];
        this.eachMethodMetadata(target, propertyKey, (meta, decor) => {
            if (!meta) {
                return;
            }
            if (filter) {
                filter(meta, decor) && metadatas.push(meta);
            } else {
                metadatas.push(meta);
            }
        });
        return metadatas;
    }

    eachParamMetadata(target: any, propertyKey: string, express: (meta: ParameterMetadata, method: string) => void | boolean, decorFilter?: Express<string, boolean>): ParameterMetadata[] {
        let decors = this.getParameterDecorators(target);
        if (decorFilter) {
            decors = decors.filter(decorFilter);
        }
        let metas: ParameterMetadata[] = [];
        decors.some(decor => {
            let clmetas = getParamMetadata<ParameterMetadata>(decor, target);
            let methodmeta = clmetas[propertyKey];
            if (methodmeta && methodmeta.length) {
                return methodmeta.some(meta => {
                    if (meta && express(meta, decor) === false) {
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
        return metas;
    }
}

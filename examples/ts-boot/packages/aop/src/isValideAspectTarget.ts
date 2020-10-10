import { Type, hasOwnClassMetadata, isClass, isBaseType, lang, IocCoreService } from '@tsdi/ioc';
import { NonePointcut } from './decorators/NonePointcut';

/**
 * is target can aspect or not.
 *
 * @export
 * @param {Type} targetType
 * @returns {boolean}
 */
export function isValideAspectTarget(targetType: Type): boolean {

    if (!isClass(targetType) || isBaseType(targetType)) {
        return false;
    }

    if (hasOwnClassMetadata(NonePointcut, targetType)) {
        return false;
    }


    if (lang.isExtendsClass(targetType, IocCoreService)) {
        return false;
    }

    return true;
}

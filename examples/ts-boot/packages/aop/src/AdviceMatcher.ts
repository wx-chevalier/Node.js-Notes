import { IAdviceMatcher, AdviceMatcherToken } from './IAdviceMatcher';
import { AdviceMetadata, AspectMetadata } from './metadatas';
import {
    Inject, getParamerterNames, getOwnMethodMetadata, hasOwnMethodMetadata,
    hasOwnClassMetadata, Singleton, isString, isRegExp, isUndefined,
    Type, ObjectMap, lang, getOwnTypeMetadata,
    isArray, isFunction, IIocContainer, IocContainerToken, hasMethodMetadata
} from '@tsdi/ioc';
import { IPointcut, MatchPointcut } from './joinpoints';
import { Advice } from './decorators/Advice';
import { Aspect } from './decorators/Aspect';
import { NonePointcut } from './decorators/NonePointcut';

/**
 * match express.
 */
export type MatchExpress = (method: string, fullName: string, targetType?: Type, target?: any, pointcut?: IPointcut) => boolean

/**
 * advice matcher, use to match advice when a registered create instance.
 *
 * @export
 * @class AdviceMatcher
 * @implements {IAdviceMatcher}
 */
@NonePointcut()
@Singleton(AdviceMatcherToken)
export class AdviceMatcher implements IAdviceMatcher {

    constructor(@Inject(IocContainerToken) private container: IIocContainer) {

    }

    match(aspectType: Type, targetType: Type, adviceMetas?: ObjectMap<AdviceMetadata[]>, target?: any): MatchPointcut[] {

        let aspectMeta = lang.first(getOwnTypeMetadata<AspectMetadata>(Aspect, aspectType));
        if (aspectMeta) {
            if (aspectMeta.without) {
                let outs = isArray(aspectMeta.without) ? aspectMeta.without : [aspectMeta.without];
                if (outs.some(t => lang.isExtendsClass(targetType, t))) {
                    return [];
                }
            }
            if (aspectMeta.within) {
                let ins = isArray(aspectMeta.within) ? aspectMeta.within : [aspectMeta.within];
                if (!ins.some(t => lang.isExtendsClass(targetType, t))) {
                    if (!aspectMeta.annotation) {
                        return [];
                    }
                }
            }
            if (aspectMeta.annotation) {
                let annotation = isFunction(aspectMeta.annotation) ? aspectMeta.annotation.toString() : aspectMeta.annotation;
                let anno = (/^\^?@\w+/.test(annotation) ? '' : '@') + annotation;
                if (!hasOwnClassMetadata(anno, targetType)) {
                    return [];
                }
            }
        }

        let className = lang.getClassName(targetType);
        adviceMetas = adviceMetas || getOwnMethodMetadata<AdviceMetadata>(Advice, targetType);
        let matched: MatchPointcut[] = [];

        if (targetType === aspectType) {
            let adviceNames = Object.keys(adviceMetas);
            if (adviceNames.length > 1) {
                let advices: AdviceMetadata[] = [];
                adviceNames.forEach(n => {
                    advices = advices.concat(adviceMetas[n]);
                });

                adviceNames.forEach(n => {
                    advices.forEach(adv => {
                        if (adv.propertyKey !== n) {
                            if (this.matchAspectSelf(n, adv)) {
                                matched.push({
                                    name: n,
                                    fullName: `${className}.${n}`,
                                    advice: adv
                                });
                            }
                        }
                    })
                });
            }
        } else {
            let points: IPointcut[] = [];
            let decorators = Object.getOwnPropertyDescriptors(targetType.prototype);
            // match method.
            for (let name in decorators) {
                points.push({
                    name: name,
                    fullName: `${className}.${name}`
                });
            }

            let allmethods = getParamerterNames(targetType);
            lang.forIn(allmethods, (item, name: string) => {
                if (name === 'constructor') {
                    return;
                }
                if (isUndefined(decorators[name])) {
                    points.push({
                        name: name,
                        fullName: `${className}.${name}`
                    });
                }
            });

            Object.getOwnPropertyNames(adviceMetas).forEach(name => {
                let advices = adviceMetas[name];
                advices.forEach(metadata => {
                    matched = matched.concat(this.filterPointcut(targetType, points, metadata));
                });
            });
        }

        return matched;

    }

    protected matchAspectSelf(name: string, metadata: AdviceMetadata): boolean {
        if (metadata.pointcut) {
            let pointcut = metadata.pointcut;

            if (isString(pointcut)) {
                if (/^execution\(\S+\)$/.test(pointcut)) {
                    pointcut = pointcut.substring(10, pointcut.length - 1);
                }
                return pointcut.startsWith(name);
            } else if (isRegExp(pointcut)) {
                return pointcut.test(name);
            }
        }
        return false;
    }

    filterPointcut(type: Type, points: IPointcut[], metadata: AdviceMetadata, target?: any): MatchPointcut[] {
        if (!metadata.pointcut) {
            return [];
        }
        let matchedPointcut;
        if (metadata.pointcut) {
            let match = this.matchTypeFactory(type, metadata);
            matchedPointcut = points.filter(p => match(p.name, p.fullName, type, target, p))
        }

        matchedPointcut = matchedPointcut || [];
        return matchedPointcut.map(p => {
            return Object.assign({}, p, { advice: metadata });
        });
    }

    protected matchTypeFactory(type: Type, metadata: AdviceMetadata): MatchExpress {
        let pointcut = metadata.pointcut;
        let expresses: (MatchExpress | string)[] = [];
        if (metadata.within) {
            expresses.push((method: string, fullName: string, targetType?: Type) => {
                if (isArray(metadata.within)) {
                    return metadata.within.some(t => lang.isExtendsClass(targetType, t));
                } else {
                    return lang.isExtendsClass(targetType, metadata.within);
                }
            });
            expresses.push('&&')
        }
        if (metadata.target) {
            expresses.push((method: string, fullName: string, targetType?: Type, target?: any) => {
                return metadata.target = target;
            });
            expresses.push('&&')
        }

        if (metadata.annotation) {
            expresses.push((method: string, fullName: string, targetType?: Type, target?: any) => {
                return hasOwnMethodMetadata(metadata.annotation, targetType, method);
            });
            expresses.push('&&')
        }
        if (isString(pointcut)) {
            let pointcuts = (pointcut || '').trim();
            expresses.push(this.tranlateExpress(type, pointcuts));
        } else if (isRegExp(pointcut)) {
            let pointcutReg = pointcut;
            if (/^\^?@\w+/.test(pointcutReg.source)) {
                expresses.push((name: string, fullName: string, targetType?: Type) => {
                    let decName = Reflect.getMetadataKeys(type, name);
                    return decName.some(n => isString(n) && pointcutReg.test(n));
                });

            } else {
                expresses.push((name: string, fullName: string) => pointcutReg.test(fullName));
            }
        }
        return this.mergeExpress(...expresses);
    }

    protected spiltBrace(strExp: string) {
        strExp = strExp.trim();

        if (/^\(/.test(strExp) && /\)$/.test(strExp)) {
            strExp = strExp.substring(1, strExp.length - 1).trim();
        }

        if (/^\(/.test(strExp) && /\)$/.test(strExp)) {
            return this.spiltBrace(strExp);
        } else {
            return strExp;
        }
    }

    protected expressToFunc(type: Type, strExp: string): MatchExpress {
        if (/^@annotation\(.*\)$/.test(strExp)) {
            let exp = strExp.substring(12, strExp.length - 1);
            let annotation = /^@/.test(exp) ? exp : ('@' + exp);
            return (name: string, fullName: string) => {
                if (name === 'constructor') {
                    return hasOwnClassMetadata(annotation, type);
                }
                return hasMethodMetadata(annotation, type, name);
            }

        } else if (/^execution\(.*\)$/.test(strExp)) {
            let exp = strExp.substring(10, strExp.length - 1);
            if (exp === '*' || exp === '*.*') {
                return (name: string, fullName: string) => !!name && !hasOwnClassMetadata(Aspect, type);
            } else if (/^\w+(\((\s*\w+\s*,)*\s*\w*\))?$/.test(exp)) {
                // if is method name, will match aspect self only.
                return () => false;
            } else if (/^([\w\*]+\.)+[\w\*]+(\((\s*\w+\s*,)*\s*\w*\))?$/.test(exp)) {
                exp = exp.replace(/\*\*/gi, '(\\\w+(\\\.|\\\/)){0,}\\\w+')
                    .replace(/\*/gi, '\\\w+')
                    .replace(/\./gi, '\\\.')
                    .replace(/\//gi, '\\\/');

                let matcher = new RegExp(exp + '$');
                return (name: string, fullName: string) => matcher.test(fullName);
            } else {
                return () => false;
            }
        } else if (/^@within\(\s*\w+/.test(strExp)) {
            let classnames = strExp.substring(strExp.indexOf('(') + 1, strExp.length - 1).split(',').map(n => n.trim());
            return (name: string, fullName: string, targetType?: Type) => classnames.indexOf(lang.getClassName(targetType)) >= 0;
        } else if (/^@target\(\s*\w+/.test(strExp)) {
            let torken = strExp.substring(strExp.indexOf('(') + 1, strExp.length - 1).trim();
            return (name: string, fullName: string, targetType?: Type) => this.container.getTokenProvider(torken) === targetType;
        } else {
            return () => false;
        }
    }

    protected tranlateExpress(type: Type, strExp: string): MatchExpress {
        let expresses: ((MatchExpress) | string)[] = [];

        let idxOr = strExp.indexOf('||');
        let idxAd = strExp.indexOf('&&');
        if (idxAd < 0 && idxOr < 0) {
            expresses.push(this.expressToFunc(type, this.spiltBrace(strExp)))
        } else {
            if (idxOr > idxAd) {
                let leftExp = this.spiltBrace(strExp.substring(0, idxOr));
                if (leftExp) {
                    expresses.push(this.tranlateExpress(type, leftExp));
                }
                let rightExp = this.spiltBrace(strExp.substring(idxOr + 2));
                if (rightExp) {
                    expresses.push('||');
                    expresses.push(this.tranlateExpress(type, rightExp));
                }
            } else if (idxAd > idxOr) {
                let leftExp = this.spiltBrace(strExp.substring(0, idxAd));
                if (leftExp) {
                    expresses.push(this.tranlateExpress(type, leftExp));
                }
                let rightExp = this.spiltBrace(strExp.substring(idxAd + 2));
                if (rightExp) {
                    expresses.push('&&');
                    expresses.push(this.tranlateExpress(type, rightExp));
                }
            }
        }

        return this.mergeExpress(...expresses);
    }


    protected mergeExpress(...expresses: (MatchExpress | string)[]): MatchExpress {
        return (method: string, fullName: string, targetType?: Type, pointcut?: IPointcut) => {
            let flag;
            expresses.forEach((express, idx) => {
                if (!isUndefined(flag)) {
                    return;
                }
                if (isFunction(express)) {
                    let rel = express(method, fullName, targetType, pointcut);
                    if (idx < expresses.length - 2) {
                        if (!rel && express[idx + 1] === '&&') {
                            flag = false;
                        }
                        if (rel && express[idx + 1] === '||') {
                            flag = true;
                        }
                    } else {
                        flag = rel;
                    }
                }

            });
            return flag;
        }
    }
}

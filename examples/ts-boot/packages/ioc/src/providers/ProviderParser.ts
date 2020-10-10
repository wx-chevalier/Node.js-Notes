import { ParamProviders, ProviderTypes } from './types';
import {
    isClass, isArray, isFunction, isNumber, isString,
    isUndefined, isNull, isToken, isBaseObject, lang, isMetadataObject
} from '../utils';
import { IProviderParser } from './IProviderParser';
import { IIocContainer } from '../IIocContainer';
import { ProviderMap, isProviderMap } from './ProviderMap';
import { Provider, ParamProvider, ObjectMapProvider } from './Provider';
import { IocCoreService } from '../services';

/**
 * provider matcher. use to find custome providers in resolve.
 *
 * note: object map provider can not resolve token.
 *
 * @export
 * @class ProviderMatcher
 * @implements {IProviderMatcher}
 */
export class ProviderParser extends IocCoreService implements IProviderParser {

    constructor(private container: IIocContainer) {
        super()
    }

    parseTo(map: ProviderMap, ...providers: ParamProviders[]): ProviderMap {
        providers.forEach((p, index) => {
            if (isUndefined(p) || isNull(p)) {
                return;
            }
            if (isProviderMap(p)) {
                map.copy(p);
            } else if (p instanceof Provider) {
                if (p instanceof ParamProvider) {
                    if (!p.type && isNumber(p.index)) {
                        map.register(p.index, (...providers: ParamProviders[]) => p.resolve(this.container, ...providers));
                    } else {
                        map.register(p.type, (...providers: ParamProviders[]) => p.resolve(this.container, ...providers));
                    }

                } else {
                    map.register(p.type, (...providers: ParamProviders[]) => p.resolve(this.container, ...providers));
                }
            } else if (isClass(p)) {
                if (!this.container.has(p)) {
                    this.container.register(p);
                }
                map.register(p, p);
            } else if (p instanceof ObjectMapProvider) {
                let pr = p.get();
                lang.forIn(pr, (val, name) => {
                    if (name && isString(name)) {
                        // object map can not resolve token. set all fileld as value factory.
                        map.register(name, () => val);
                    }
                });

            } else if (isBaseObject(p)) {
                let pr: any = p;
                if (isToken(pr.provide)) {
                    if (isArray(pr.deps) && pr.deps.length) {
                        pr.deps.forEach(d => {
                            if (isClass(d) && !this.container.has(d)) {
                                this.container.register(d);
                            }
                        });
                    }
                    if (!isUndefined(pr.useValue)) {
                        map.register(pr.provide, () => pr.useValue);
                    } else if (isClass(pr.useClass)) {
                        if (!this.container.has(pr.useClass)) {
                            this.container.register(pr.useClass);
                        }
                        map.register(pr.provide, pr.useClass);
                    } else if (isFunction(pr.useFactory)) {
                        map.register(pr.provide, (...providers: ProviderTypes[]) => {
                            let args = [];
                            if (isArray(pr.deps) && pr.deps.length) {
                                args = pr.deps.map(d => {
                                    if (isToken(d)) {
                                        return this.container.resolve(d, ...providers);
                                    } else {
                                        return d;
                                    }
                                });
                            }
                            return pr.useFactory.apply(pr, args.concat(providers));
                        });
                    } else if (isToken(pr.useExisting)) {
                        map.register(pr.provide, (...providers: ProviderTypes[]) => this.container.resolve(pr.useExisting, ...providers));
                    }
                }
            }
            // else if (isFunction(p)) {
            //     map.add(name, () => p);
            // }
        });

        return map;
    }

    parse(...providers: ParamProviders[]): ProviderMap {
        if (providers.length === 1 && isProviderMap(providers[0])) {
            return providers[0] as ProviderMap;
        }
        let map = this.container.get(ProviderMap);
        return this.parseTo(map, ...providers);
    }
}

/**
 * is provider or not.
 *
 * @export
 * @param {*} target
 * @returns {target is ProviderTypes}
 */
export function isProvider(target: any): target is ProviderTypes {
    return isProviderMap(target)
        // || isClass(target)
        || target instanceof ObjectMapProvider
        || target instanceof Provider
        || (isMetadataObject(target, 'provide') && isToken(target.provide));
}

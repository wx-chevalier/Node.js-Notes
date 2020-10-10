import { Type, InjectToken } from '@tsdi/ioc';
import { ModuleConfigure } from './modules';

/**
 * module decorator metadata service
 *
 * @export
 * @interface IModuleDecoratorService
 */
export interface IModuleDecoratorService {
    getDecorator(type: Type): string;
    getAnnoation(type: Type, decorator?: string): ModuleConfigure;
}

export const ModuleDecoratorServiceToken = new InjectToken<IModuleDecoratorService>('ModuleDecoratorService');

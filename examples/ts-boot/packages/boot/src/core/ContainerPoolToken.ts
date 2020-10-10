import { InjectToken, Token, SymbolType, IIocContainer } from '@tsdi/ioc';
import { IContainer } from '@tsdi/core';

/**
 * root container token.
 */
export const RootContainerToken = new InjectToken<IContainer>('__ioc_root_container');
/**
 * parent container token.
 */
export const ParentContainerToken = new InjectToken<IContainer>('__ioc_parent_container');
/**
 * children container token.
 */
export const ChildrenContainerToken = new InjectToken<IContainer[]>('__ioc_children_container');
/**
 *  container pool token.
 */
export const ContainerPoolToken = new InjectToken<IContainerPool>('DI_ContainerPool');

export interface IContainerPool {
    getTokenKey(token: Token): SymbolType;

    isRoot(container: IContainer): boolean;


    getRoot(): IContainer;

    getContainers(): IContainer[];

    has(container: IContainer): boolean;

    hasParent(container: IContainer): boolean;

    create(parent?: IContainer): IContainer;

    setParent(container: IContainer, parent?: IContainer);

    getParent(container: IIocContainer): IContainer;

    iterator(express: (resolvor?: IContainer) => void | boolean): void | boolean;
}

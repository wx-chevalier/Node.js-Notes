import { IBinding, DataBinding } from '../bindings';
import { IContainer } from '@tsdi/core';
import { ContainerFactory, Injectable, Type } from '@tsdi/ioc';
import { BuildContext, IModuleResolveOption, IComponentContext } from '@tsdi/boot';


export interface IBindingParseOption extends IModuleResolveOption  {
    scope?: any;
    bindExpression?: any;
    binding: IBinding;
}

@Injectable
export class ParseContext extends BuildContext implements IComponentContext {

    binding: IBinding;

    bindExpression?: any;

    dataBinding?: DataBinding;

    scope?: any;

    value?: any;

    getRaiseContainer(): IContainer {
        return this.raiseContainer() as IContainer;
    }

    static parse(type: Type, options: IBindingParseOption, raiseContainer?: IContainer | ContainerFactory<IContainer>): ParseContext {
        let ctx = new ParseContext(type);
        ctx.setOptions(options);
        raiseContainer && ctx.setRaiseContainer(raiseContainer);
        return ctx;
    }
}

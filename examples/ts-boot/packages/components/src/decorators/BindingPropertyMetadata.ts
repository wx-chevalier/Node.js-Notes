import { BindingTypes } from '../bindings';
import { ParamPropMetadata } from '@tsdi/ioc';


export interface BindingPropertyMetadata extends ParamPropMetadata {
    bindingName?: string;
    defaultValue?: any;
    bindingType?: BindingTypes;
}

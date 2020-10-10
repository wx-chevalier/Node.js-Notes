import { ComponentSelectorHandle } from '@tsdi/components';
import { isClass, hasOwnClassMetadata, lang, Type, isMetadataObject } from '@tsdi/ioc';
import { Activity } from '../core';
import { SequenceActivity } from '../activities';

export class TaskDecorSelectorHandle extends ComponentSelectorHandle {

    protected getSelector(template: any) {
        return isMetadataObject(template) ? template.activity : null;
    }

    protected getDefaultCompose(): Type {
        return SequenceActivity;
    }

    protected isElement(decorator: string, activity: any): boolean {
        return isClass(activity) && (hasOwnClassMetadata(decorator, activity) || lang.isExtendsClass(activity, Activity));
    }
}

import { IocAction } from '@tsdi/ioc';
import { AnnoationContext } from '../AnnoationContext';

export abstract class AnnoationAction extends IocAction<AnnoationContext> {
    abstract execute(ctx: AnnoationContext, next: () => void): void;
}

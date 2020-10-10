import { DIModule, RegFor } from '@tsdi/boot';
import { BrowserModule } from '@tsdi/platform-browser';
import { TaskLogAspect, RunnerLogAspect } from './aop';
import { WorkflowConfigureRegister } from './WorkflowConfigureRegister';

@DIModule({
    regFor: RegFor.boot,
    imports: [
        BrowserModule,
        TaskLogAspect,
        RunnerLogAspect,
        WorkflowConfigureRegister
    ]
})
export class BrowserActivitiesModule {

}

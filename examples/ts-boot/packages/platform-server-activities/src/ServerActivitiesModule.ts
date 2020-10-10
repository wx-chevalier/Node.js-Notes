import { DIModule, RegFor } from '@tsdi/boot';
import { ServerModule } from '@tsdi/platform-server';
import { ServerBootstrapModule } from '@tsdi/platform-server-boot';
import { TaskLogAspect, RunnerLogAspect } from './aop';
import { WorkflowConfigureRegister } from './WorkflowConfigureRegister';
import { ServerLogsModule } from '@tsdi/platform-server-logs';
import { ServerParallelExecutor } from './ServerParallelExecutor';
import { ParallelExecutor } from '@tsdi/activities';


@DIModule({
    regFor: RegFor.boot,
    imports: [
        ServerModule,
        ServerLogsModule,
        RunnerLogAspect,
        TaskLogAspect,
        ServerParallelExecutor,
        ServerBootstrapModule,
        WorkflowConfigureRegister
    ],
    providers: [
        { provide: ParallelExecutor, useExisting: ServerParallelExecutor }
    ]
})
export class ServerActivitiesModule {

}

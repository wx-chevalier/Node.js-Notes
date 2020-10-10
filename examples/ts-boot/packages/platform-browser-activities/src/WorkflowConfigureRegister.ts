import { ConfigureRegister, RunnableConfigure } from '@tsdi/boot';
import { Singleton } from '@tsdi/ioc';
import { DebugLogAspect } from '@tsdi/logs';


@Singleton
export class WorkflowConfigureRegister extends ConfigureRegister {

    async register(config: RunnableConfigure): Promise<void> {
        if (config.debug) {
            this.container.register(DebugLogAspect);
        }
    }
}

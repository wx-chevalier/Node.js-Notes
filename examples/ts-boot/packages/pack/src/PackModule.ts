import { DIModule, RegFor } from '@tsdi/boot';
import * as cores from './core';
import * as tasks from './tasks';
import * as transforms from './transforms';
import * as rollups from './rollups';
import * as builds from './builds';
import { ServerBootstrapModule } from '@tsdi/platform-server-boot';

@DIModule({
    regFor: RegFor.boot,
    imports: [
        ServerBootstrapModule,
        cores,
        tasks,
        rollups,
        transforms,
        builds
    ],
    exports: [
        ServerBootstrapModule,
        cores,
        tasks,
        rollups,
        transforms,
        builds
    ]
})
export class PackModule {

}

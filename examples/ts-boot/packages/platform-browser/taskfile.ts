import { PackModule, LibPackBuilderOption } from '@tsdi/pack';
import { Workflow, Task } from '@tsdi/activities';
import { ServerActivitiesModule } from '@tsdi/platform-server-activities';

@Task({
    deps: [
        PackModule,
        ServerActivitiesModule
    ],
    baseURL: __dirname,
    template: <LibPackBuilderOption>{
        activity: 'libs',
        outDir: '../../dist/platform-browser',
        src: 'src/**/*.ts',
        test: 'test/**/*.ts',
        annotation: true,
        bundles: [
            { target: 'es5', targetFolder: 'src', dtsMain: 'index.d.ts' },
            { input: 'src/index.js', moduleName: 'main', moduleFolder: 'bundle', outputFile: 'platform-browser.umd.js', format: 'umd', uglify: true },
            { input: 'src/index.js', moduleName: ['fesm5', 'esm5'], outputFile: 'platform-browser.js', format: 'cjs' },
            { target: 'es2015', input: 'es2015/index.js', moduleName: ['fesm2015', 'esm2015'], outputFile: 'platform-browser.js', format: 'cjs' },
            { target: 'es2017', input: 'es2017/index.js', moduleName: ['fesm2017', 'esm2017'], outputFile: 'platform-browser.js', format: 'cjs' }
        ]
    }
})
export class PfBrowserBuilder {
}

if (process.cwd() === __dirname) {
    Workflow.run(PfBrowserBuilder);
}


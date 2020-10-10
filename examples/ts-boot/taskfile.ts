import { Workflow, Task, Activities, isAcitvityClass, Activity } from '@tsdi/activities';
import * as path from 'path';
import { PackModule, NodeActivityContext, JsonReplaceActivityOption } from '@tsdi/pack';
import { Type, isString } from '@tsdi/ioc';
import { ServerActivitiesModule } from '@tsdi/platform-server-activities';

@Task({
    deps: [
        PackModule,
        ServerActivitiesModule
    ],
    baseURL: __dirname,
    template: [
        {
            activity: Activities.if,
            condition: (ctx: NodeActivityContext) => {
                let unp = ctx.platform.getEnvArgs().unp;
                return isString(unp) && /\d+.\d+.\d+/.test(unp);
            },
            body: {
                activity: 'shell',
                shell: (ctx: NodeActivityContext) => {
                    let packages = ctx.platform.getFolders('packages');
                    let version = ctx.platform.getEnvArgs().unp;
                    let cmds = [];
                    packages.forEach(fd => {
                        let objs = require(path.join(fd, 'package.json'));
                        if (objs && objs.name) {
                            cmds.push(`npm unpublish ${objs.name}@${version}`)
                        }
                    });
                    console.log(cmds);
                    return cmds;
                }
            }
        },
        {
            activity: Activities.elseif,
            condition: (ctx: NodeActivityContext) => ctx.platform.getEnvArgs().build !== 'false',
            body: [
                {
                    activity: Activities.if,
                    condition: (ctx: NodeActivityContext) => ctx.platform.getEnvArgs().setvs,
                    body: [{
                        activity: 'asset',
                        name: 'version-setting',
                        src: 'packages/**/package.json',
                        dist: 'packages',
                        pipes: [
                            <JsonReplaceActivityOption>{
                                activity: 'jsonReplace',
                                fields: (json, ctx) => {
                                    let chgs = new Map<string, any>();
                                    let version = ctx.platform.getEnvArgs().setvs;
                                    chgs.set('version', version);
                                    Object.keys(json.peerDependencies || {}).forEach(key => {
                                        if (/^@tsdi/.test(key)) {
                                            chgs.set('peerDependencies.' + key, '^' + version);
                                        }
                                    });
                                    Object.keys(json.dependencies || {}).forEach(key => {
                                        if (/^@tsdi/.test(key)) {
                                            chgs.set('dependencies.' + key, '^' + version);
                                        }
                                    });
                                    return chgs;
                                }
                            }]
                    },
                    {
                        activity: 'asset',
                        name: 'version-setting',
                        src: 'package.json',
                        dist: '.',
                        pipes: [
                            <JsonReplaceActivityOption>{
                                activity: 'jsonReplace',
                                fields: (json, ctx) => {
                                    let version = ctx.platform.getEnvArgs().setvs;
                                    return { version: version };
                                }
                            }]
                    }]
                },
                {
                    activity: Activities.each,
                    each: (ctx: NodeActivityContext) => ctx.platform.getFolders('packages').filter(f => !f.endsWith('unit-karma')),
                    // parallel: true,
                    body: {
                        activity: Activities.execute,
                        action: async (ctx) => {
                            let activitys = Object.values(require(path.join(ctx.body, 'taskfile.ts'))).filter(b => isAcitvityClass(b)) as Type<Activity<any>>[];
                            // await ctx.getExector().runActivity(ctx, activitys);
                            await Workflow.sequence(...activitys);
                        }
                    }
                }
            ]
        },
        {
            activity: Activities.if,
            condition: (ctx: NodeActivityContext) => ctx.platform.getEnvArgs().deploy,
            body: {
                activity: 'shell',
                shell: (ctx: NodeActivityContext) => {
                    let packages = ctx.platform.getFolders('dist');
                    let cmd = 'npm publish --access=public'; // envArgs.deploy ? 'npm publish --access=public' : 'npm run build';

                    let shells = packages.map(fd => {
                        return `cd ${fd} && ${cmd}`;
                    });
                    console.log(shells);
                    return shells;
                }
            }
        }
    ]
})
export class BuilderTsIoc {

}

Workflow.run(BuilderTsIoc)

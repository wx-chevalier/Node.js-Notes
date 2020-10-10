# packaged @tsdi/platform-server-activities
`@tsdi/platform-server-activities` is activities framework for nodejs, base on AOP, Ioc container, via @tsdi. file stream pipes activities.

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities#readme).
Please file issues and pull requests against that repo.


## Install

1. install modules:

```shell
npm install @tsdi/platform-server-activities
```

3. install cli | build pack:

### cli in global
```shell
npm install -g '@tsdi/cli'
```
### build pack
```
npm install '@tsdi/pack'
```

use command: `pk run [taskfile.ts], pk run [taskfile.js]`


You can `import` modules:


## Doc

### Define Task

* Single task

```ts
@Task('test')
class SimpleTask extends AbstractTask implements ITask {

    constructor(name: string) {
        super(name);
    }

    run(): Promise<any> {
        // console.log('before simple activity:', this.name);
        return Promise.resolve('simple task')
            .then(val => {
                console.log('return simple activity:', val);
                return val;
            });
    }
}

```

* control flow activities.

see [control flow codes](https://github.com/zhouhoujun/tsioc/tree/master/packages/activities/src/activities)


* Task module

```ts


```

### Run task

```ts
1.
let wf = new Worflow(moudles)
2.
Workflow.create( moudles)
    .bootstrap(<IConfigure>{
        ...
        activity:...
    });
3.
Workflow.create( moudles)
    .bootstrap(TestTask);
4.
Workflow.create()
    .sequence(TestTask, TsCompile, <IConfigure>{
        ...
        activity: ...
    });
5.
Workflow.create()
    .run(...[TestTask, TsCompile, <IConfigure>{
        ...
        activity: ...
    }]);

```

## Simples

```ts
import { Workflow, IfActivityToken, SequenceActivityToken, ExecuteToken } from '@tsdi/activities';
import { INodeActivityContext, Asset, BuildModule, AssetToken, ShellModule, TransformModule, NodeActivityContext } from '@tsdi/build';
import * as through from 'through2';
import * as path from 'path';
import { isPackClass, PackModule } from '@tsdi/pack';

@Asset({
    pipes: [
        {
            ifBody: {
                sequence: [
                    {
                        src: ['packages/**/package.json', '!packages/activities/**/package.json', '!node_modules/**/package.json'],
                        pipes: [
                            ctx => versionSetting(ctx)
                        ],
                        dest: 'packages',
                        activity: AssetToken
                    },
                    {
                        src: ['package.json'],
                        pipes: [
                            ctx => versionSetting(ctx)
                        ],
                        dest: '.',
                        activity: AssetToken
                    }
                ],
                activity: SequenceActivityToken
            },
            if: ctx => ctx.getEnvArgs().setvs,
            activity: IfActivityToken
        },
        {
            execute: (ctx: INodeActivityContext) => {
                let envArgs = ctx.getEnvArgs();
                let packages = ctx.getFolders('packages').filter(f => !/activities/.test(f)); // (f => !/(annotations|aop|bootstrap)/.test(f));

                let activities = [];
                packages.forEach(fd => {
                    let objs = require(path.join(fd, 'taskfile.ts'));
                    let builder = Object.values(objs).find(v => isPackClass(v));
                    activities.push(builder);
                });
                if (envArgs.deploy) {
                    let cmd = 'npm publish --access=public'; // envArgs.deploy ? 'npm publish --access=public' : 'npm run build';
                    let cmds = packages.map(fd => {
                        return `cd ${fd} && ${cmd}`;
                    });
                    console.log(cmds);
                    activities.push({
                        shell: cmds,
                        activity: 'shell'
                    });
                }
                return {
                    contextType: NodeActivityContext,
                    sequence: activities,
                    activity: SequenceActivityToken
                }
            },
            activity: ExecuteToken
        }
    ]
})
export class BuilderIoc {
}

@Asset({
    pipes: [
        {
            if: ctx => ctx.getEnvArgs().setvs,
            ifBody: {
                src: ['packages/activities/**/package.json', '!node_modules/**/package.json'],
                pipes: [
                    (ctx) => actVersionSetting(ctx)
                ],
                dest: 'packages/activities',
                activity: AssetToken
            },
            activity: IfActivityToken
        },
        {
            execute: (ctx: INodeActivityContext) => {
                let envArgs = ctx.getEnvArgs();
                let packages = ctx.getFolders('packages/activities');

                let activities = [];
                packages.forEach(fd => {
                    // console.log(path.join(fd, 'taskfile.ts'));
                    let objs = require(path.join(fd, 'taskfile.ts'));
                    let builder = Object.values(objs).find(v => isPackClass(v));
                    activities.push(builder);
                });
                if (envArgs.deploy) {
                    let cmd = 'npm publish --access=public';
                    let cmds = packages.map(fd => {
                        return `cd ${fd} && ${cmd}`;
                    });
                    console.log(cmds);
                    activities.push({
                        shell: cmds,
                        activity: 'shell'
                    });
                }
                return {
                    sequence: activities,
                    activity: SequenceActivityToken
                }
            },
            activity: ExecuteToken
        }
    ]
})
export class BuilderActivities {
}



Workflow.create()
    .use(PackModule)
    .bootstrap({
        contextType: NodeActivityContext,
        if: ctx => ctx.getEnvArgs().act,
        ifBody: BuilderActivities,
        elseBody: BuilderIoc,
        activity: IfActivityToken
    });



```

## Documentation [github](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities#readme)

Documentation is available on the
[type-task docs site](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities#readme).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)
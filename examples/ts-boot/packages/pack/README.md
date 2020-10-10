# packaged @tsdi/pack
`@tsdi/pack` is project build pack tools, base on AOP, Ioc container, via @tsdi. file stream pipes activities.

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities#readme).
Please file issues and pull requests against that repo.


## Install

1. install modules:

```shell
npm install @tsdi/pack
```

2. install cli | build pack:

### cli in global
```shell
npm install -g '@tsdi/cli'
```
### build pack
```
npm install '@tsdi/pack'
```

use command: `tsdi run [taskfile.ts], tsdi run [taskfile.js]`
use command: `tsdi build [options]`

You can `import` modules:


## Doc

### Define Task

* define task component or attr task item.

```ts

@Task('clean, [clean]')
export class CleanActivity extends Activity<void> {

    @Input()
    protected clean: Expression<Src>;


    constructor(@Input() clean?: Expression<Src>) {
        super()
        this.clean = clean;
    }

    protected async execute(ctx: NodeActivityContext): Promise<void> {
        let clean = await this.resolveExpression(this.clean, ctx);
        if (clean) {
            await ctx.del(ctx.toRootSrc(clean), {force: true});
        }
    }
}


```

* control flow activities.

see [control flow codes](https://github.com/zhouhoujun/tsioc/tree/master/packages/activities/src/activities)


### Define component Task

```ts
export interface LibTaskOption {
    clean?: Binding<Expression<Src>>;
    src?: Binding<Expression<Src>>;
    dist?: Binding<Expression<Src>>;
    uglify?: Binding<Expression<boolean>>;
    tsconfig?: Binding<Expression<string | CompilerOptions>>;

    /**
     * rollup input.
     *
     * @type {Binding<Expression<string>>}
     * @memberof LibTaskOption
     */
    input?: Binding<Expression<string>>;
    /**
     * rollup output file.
     *
     * @type {Binding<string>}
     * @memberof LibTaskOption
     */
    outputFile?: Binding<Expression<string>>;
    /**
     * rollup output dir.
     *
     * @type {Binding<string>}
     * @memberof LibTaskOption
     */
    outputDir?: Binding<Expression<string>>;
    /**
     * rollup format option.
     *
     * @type {Binding<string>}
     * @memberof LibTaskOption
     */
    format?: Binding<Expression<string>>;
}

@Task({
    selector: 'libs',
    template: {
        activity: 'each',
        each: 'binding: tasks'
        body: [
            {
                activity: 'if',
                condition: ctx => ctx.body.src,
                body: <TsBuildOption>{
                    activity: 'ts',
                    clean: ctx => ctx.body.clean,
                    src: ctx => ctx.body.src,
                    test: ctx => ctx.body.test,
                    uglify: ctx => ctx.body.uglify,
                    dist: ctx => ctx.body.dist,
                    annotation: true,
                    sourcemaps: './sourcemaps',
                    tsconfig: ctx => ctx.body.tsconfig
                }
            },
            {
                activity: Activities.if,
                condition: ctx => ctx.body.input,
                body: <RollupOption>{
                    activity: 'rollup',
                    input: ctx => ctx.body.input,
                    plugins: 'binding: plugins',
                    external: 'binding: external',
                    options: 'binding: options',
                    output: ctx => {
                        return {
                            format: ctx.body.format || 'cjs',
                            file: ctx.body.outputFile,
                            dir: ctx.body.outputDir,
                            globals: ctx.scope.globals
                        }
                    }
                }
            }
        ]
    }
})
export class LibPackBuilder implements AfterInit {

    constructor(private yourService: ServiceClass){

    }
    /**
     * tasks
     *
     * @type {(Expression<LibTaskOption|LibTaskOption[]>)}
     * @memberof LibPackBuilderOption
     */
    @Input()
    tasks: Expression<LibTaskOption | LibTaskOption[]>;
    /**
     * rollup external setting.
     *
     * @type {Expression<ExternalOption>}
     * @memberof RollupOption
     */
    @Input()
    external?: Expression<ExternalOption>;
    /**
     * rollup plugins setting.
     *
     * @type {Expression<Plugin[]>}
     * @memberof RollupOption
     */
    @Input()
    plugins?: Expression<Plugin[]>;

    @Input()
    cache?: Expression<RollupCache>;

    @Input()
    watch?: Expression<WatcherOptions>;
    /**
     * custom setup rollup options.
     *
     * @type {(Expression<RollupFileOptions | RollupDirOptions>)}
     * @memberof RollupOption
     */
    @Input()
    options?: Expression<RollupFileOptions | RollupDirOptions>;


    async onAfterInit(): Promise<void> {
        // to do init you component
        // this.yourService.
    }


}

```


### Run task

* use coustom task component.
```ts
@Task({
    deps: [
        PackModule,
        ServerActivitiesModule
    ],
    imports:[ LibPackBuilder ],
    baseURL: __dirname,
    template: <LibPackBuilderOption>{
        activity: 'libs',
        tasks:[
            { src: 'src/**/*.ts', clean: ['../../dist/pack/lib'], dist: '../../dist/pack/lib', uglify: false, tsconfig: './tsconfig.json' }
        ]
    }
})
export class PackBuilder implements AfterInit {
    onAfterInit(): void | Promise<void> {
        console.log('pack build has inited...')
    }
}

```

* run task.
```ts
// 1. run modue
Workflow.run(PackBuilder);


// 2. run option
Workflow.run({
    name: 'test1',
    template: [
        {
            name: 'test------1',
            activity: SimpleTask
        },
        SimpleCTask
        // {
        //     name: 'test------2',
        //     activity: SimpleCTask
        // }
    ]

});
```

## Documentation [github](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities#readme)

Documentation is available on the
[type-task docs site](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities#readme).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)
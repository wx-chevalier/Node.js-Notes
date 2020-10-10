import { Task, TemplateOption, Src, Activities, ActivityTemplate } from '@tsdi/activities';
import { BuilderTypes } from './BuilderTypes';
import { TsBuildOption, AssetActivityOption, JsonEditActivityOption } from '../transforms';
import { CompilerOptions } from 'typescript';
import { ExternalOption, RollupCache, WatcherOptions, RollupFileOptions, RollupDirOptions, GlobalsOption, Plugin } from 'rollup';
import { RollupOption } from '../rollups';
import { Input, AfterInit, Binding } from '@tsdi/components';
import { NodeActivityContext, NodeExpression } from '../core';
const resolve = require('rollup-plugin-node-resolve');
const rollupSourcemaps = require('rollup-plugin-sourcemaps');
const commonjs = require('rollup-plugin-commonjs');
// const buildin = require('rollup-plugin-node-builtins');
// const ts = require('rollup-plugin-typescript');
// import { rollupClassAnnotations } from '@tsdi/annotations';
import { isNullOrUndefined, isBoolean, isArray, lang } from '@tsdi/ioc';
import { join } from 'path';
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
// const grollup = require('gulp-rollup');
// const postcss = require('rollup-plugin-postcss');
// const terser = require('rollup-plugin-terser');


export interface LibBundleOption {
    /**
     * typescript build target.
     *
     * @type {string}
     * @memberof LibBundleOption
     */
    target?: string;

    targetFolder?: string;

    /**
     * default `index.js`
     *
     * @type {string}
     * @memberof LibBundleOption
     */
    main?: string;
    /**
     * for package typings
     *
     * @type {string}
     * @memberof LibTaskOption
     */
    dtsMain?: string
    /**
     * module name output for package.
     *
     * @type {string}
     * @memberof LibTaskOption
     */
    moduleName?: string | string[];

    /**
     * output module folder name in outdir path. default use module name as folder name.
     *
     * @type {string}
     * @memberof LibTaskOption
     */
    moduleFolder?: string;

    annotation?: boolean;
    uglify?: boolean;
    tsconfig?: string | CompilerOptions;

    /**
     * rollup input.
     *
     * @type {Src>>}
     * @memberof LibTaskOption
     */
    input?: Src;
    /**
     * the file name (with out dir path) rollup to write, or main file name.
     *
     * @type {string>}
     * @memberof LibTaskOption
     */
    outputFile?: string;

    /**
     * rollup format option.
     *
     * @type {string>}
     * @memberof LibTaskOption
     */
    format?: string;
}

export interface LibPackBuilderOption extends TemplateOption {
    /**
     * tasks
     *
     * @type { Binding<LibBundleOption[]>}
     * @memberof LibPackBuilderOption
     */
    bundles: Binding<NodeExpression<LibBundleOption[]>>;

    /**
     * project source.
     *
     * @type {Binding<string>}
     * @memberof LibPackBuilderOption
     */
    src: Binding<Src>;

    /**
     * project out dir.
     *
     * @type {Binding<string>}
     * @memberof LibPackBuilderOption
     */
    outDir: Binding<string>;

    /**
     * annotation source file.
     *
     * @type {Binding<NodeExpression<boolean>>}
     * @memberof LibPackBuilderOption
     */
    annotation?: Binding<NodeExpression<boolean>>;

    /**
     * dts sub folder name
     *
     * @type {string}
     * @memberof LibTaskOption
     */
    dts?: Binding<string>,

    /**
     * enable source maps or not.
     *
     * @type {Binding<NodeExpression<boolean|string>>}
     * @memberof RollupOption
     */
    sourcemap?: Binding<NodeExpression<boolean | string>>;

    test?: Binding<Src>;

    /**
     * rollup external setting.
     *
     * @type {NodeExpression<ExternalOption>}
     * @memberof RollupOption
     */
    external?: Binding<NodeExpression<ExternalOption>>;

    /**
     * custome config all rollup plugins.
     *
     * @type {NodeExpression<Plugin[]>}
     * @memberof RollupOption
     */
    plugins?: Binding<NodeExpression<Plugin[]>>;

    cache?: Binding<NodeExpression<RollupCache>>;

    watch?: Binding<NodeExpression<WatcherOptions>>;

    globals?: Binding<NodeExpression<GlobalsOption>>;
    /**
     * custom setup rollup options.
     *
     * @type {(NodeExpression<RollupFileOptions | RollupDirOptions>)}
     * @memberof RollupOption
     */
    options?: Binding<NodeExpression<RollupFileOptions | RollupDirOptions>>;

    /**
     * postcss option.
     *
     * @type {Binding<NodeExpression>}
     * @memberof LibPackBuilderOption
     */
    postcssOption?: Binding<NodeExpression>;

    /**
     * external Libs for auto create rollup options.
     *
     * @type {string[]}
     * @memberof LibBundleOption
     */
    externalLibs?: Binding<string[]>;

    /**
     * include libs for auto create rollup options.
     *
     * @type {Binding<string[]>}
     * @memberof LibPackBuilderOption
     */
    includeLib?: Binding<string[]>;

    /**
     * use this plugins before auto generate plugins.
     *
     * resolveId
     * ` (source: string, importer: string) => string | false | null | {id: string, external?: boolean, moduleSideEffects?: boolean | null}`
     *
     * @type { Binding<NodeExpression<Plugin[]>>;}
     * @memberof LibPackBuilderOption
     */
    beforeResolve?: Binding<NodeExpression<Plugin[]>>;

}

@Task({
    selector: BuilderTypes.libs,
    template: <ActivityTemplate>[
        {
            activity: 'clean',
            clean: 'binding: outDir'
        },
        {
            activity: 'test',
            test: 'binding: test',
        },
        {
            activity: 'asset',
            src: ['package.json', '*.md'],
            dist: 'binding: outDir'
        },
        {
            activity: 'each',
            each: 'binding: bundles',
            body: [
                {
                    activity: Activities.if,
                    condition: ctx => ctx.body.target,
                    body: <TsBuildOption>{
                        activity: 'ts',
                        src: 'binding: src',
                        dist: ctx => ctx.scope.getTargetPath(ctx.body),
                        dts: ctx => ctx.scope.dts ? ctx.scope.dts : (ctx.body.dtsMain ? './' : null),
                        annotation: 'binding: annotation',
                        sourcemap: 'binding: sourcemap',
                        tsconfig: ctx => ctx.scope.getCompileOptions(ctx.body.target)
                    }
                },
                {
                    activity: Activities.if,
                    condition: ctx => ctx.body.input,
                    body: [
                        <RollupOption>{
                            activity: 'rollup',
                            input: ctx => ctx.scope.toOutputPath(ctx.body.input),
                            sourcemap: 'binding: sourcemap',
                            plugins: 'binding: plugins',
                            external: 'binding: external',
                            options: 'binding: options',
                            globals: 'binding: globals',
                            output: ctx => {
                                return {
                                    format: ctx.body.format || 'cjs',
                                    file: ctx.body.outputFile ? ctx.scope.toModulePath(ctx.body, ctx.body.outputFile) : undefined,
                                    dir: ctx.body.outputFile ? undefined : ctx.scope.toModulePath(ctx.body),
                                }
                            }
                        },
                        {
                            activity: Activities.if,
                            condition: ctx => ctx.body.uglify,
                            body: <AssetActivityOption>{
                                activity: 'asset',
                                src: ctx => isArray(ctx.body.input) ? ctx.scope.toModulePath(ctx.body, '/**/*.js') : ctx.scope.toModulePath(ctx.body, ctx.body.outputFile),
                                dist: ctx => ctx.scope.toModulePath(ctx.body),
                                sourcemap: 'binding: zipMapsource',
                                pipes: [
                                    ctx => uglify(),
                                    (ctx) => rename({ suffix: '.min' })
                                ]
                            }
                        }
                    ]
                },
                {
                    activity: Activities.if,
                    condition: ctx => ctx.body.moduleName || ctx.body.target,
                    body: <AssetActivityOption>{
                        activity: 'asset',
                        src: ctx => ctx.scope.toOutputPath('package.json'),
                        dist: ctx => ctx.scope.outDir,
                        pipes: [
                            <JsonEditActivityOption>{
                                activity: 'jsonEdit',
                                json: (json, ctx) => {
                                    // to replace module export.
                                    if (ctx.body.target) {
                                        json[ctx.body.target] = ['.', ctx.scope.getTargetFolder(ctx.body), ctx.body.main || 'index.js'].join('/');
                                    }
                                    let outmain = ['.', ctx.scope.getModuleFolder(ctx.body), ctx.body.outputFile || 'index.js'].join('/');
                                    if (isArray(ctx.body.moduleName)) {
                                        ctx.body.moduleName.forEach(n => {
                                            json[n] = outmain;
                                        })
                                    } else if (ctx.body.moduleName) {
                                        json[ctx.body.moduleName] = outmain;
                                    }
                                    if (ctx.body.dtsMain) {
                                        json['typings'] = ['.', ctx.scope.getTargetFolder(ctx.body), ctx.body.dtsMain].join('/');
                                    }
                                    return json;
                                }
                            }
                        ]
                    }
                }
            ]
        }
    ]
})
export class LibPackBuilder implements AfterInit {

    constructor() {

    }

    @Input() src: Src;
    @Input() test: Src;
    /**
     * tasks
     *
     * @type {(LibBundleOption[])}
     * @memberof LibPackBuilderOption
     */
    @Input() bundles: NodeExpression<LibBundleOption[]>;
    @Input() outDir: string;
    @Input() annotation: NodeExpression<boolean>;

    /**
     * rollup external setting.
     *
     * @type {NodeExpression<ExternalOption>}
     * @memberof RollupOption
     */
    @Input() external?: NodeExpression<ExternalOption>;
    @Input() externalLibs: string[];
    @Input() includeLib: string[];
    /**
     * rollup plugins setting.
     *
     * @type {NodeExpression<Plugin[]>}
     * @memberof RollupOption
     */
    @Input() plugins: NodeExpression<Plugin[]>;
    @Input() globals: NodeExpression<GlobalsOption>;
    @Input() cache?: NodeExpression<RollupCache>;
    @Input() watch?: NodeExpression<WatcherOptions>;
    /**
     * custom setup rollup options.
     *
     * @type {(NodeExpression<RollupFileOptions | RollupDirOptions>)}
     * @memberof RollupOption
     */
    @Input() options?: NodeExpression<RollupFileOptions | RollupDirOptions>;
    @Input() sourcemap?: NodeExpression<boolean | string>;
    @Input() postcssOption: NodeExpression;

    @Input() beforeResolve: NodeExpression<Plugin[]>

    get zipMapsource() {
        if (this.sourcemap && isBoolean(this.sourcemap)) {
            return './';
        }
        return this.sourcemap;
    }

    getCompileOptions(target: string) {
        if (target) {
            return { target: target };
        }
        return {};
    }


    toOutputPath(...mdpath: string[]): string {
        return join(...[this.outDir, ...mdpath.filter(f => f)]);
    }

    toModulePath(body: any, ...paths: string[]): string {
        return join(...[
            this.outDir,
            this.getModuleFolder(body),
            ...paths.filter(f => f)]);
    }

    getTargetPath(body) {
        return this.toOutputPath(this.getTargetFolder(body));
    }

    getTargetFolder(body: any): string {
        return body.targetFolder || body.target;
    }

    getModuleFolder(body: any): string {
        return body.moduleFolder || (isArray(body.moduleName) ? lang.first(body.moduleName) : body.moduleName)
    }

    async onAfterInit(): Promise<void> {
        if (!this.external) {
            let func = (ctx: NodeActivityContext) => {
                let packagejson = ctx.platform.getPackage();
                let external = [
                    'process', 'util', 'path', 'fs', 'events', 'stream', 'child_process', 'os',
                    'https', 'http', 'url', 'crypto',
                    ...(this.externalLibs || []),
                    ...Object.keys(packagejson.dependencies || {}),
                    ...Object.keys(packagejson.peerDependencies || {})];
                if (external.indexOf('rxjs')) {
                    external.push('rxjs/operators')
                }
                if (this.includeLib && this.includeLib.length) {
                    external = external.filter(ex => this.includeLib.indexOf(ex) < 0);
                }
                return external;
            };
            this.external = (ctx) => {
                return func(ctx);
            }
            this.globals = (ctx) => {
                let globals = {};
                func(ctx).forEach(k => {
                    if (!globals[k]) {
                        globals[k] = k;
                    }
                });
                return globals;
            }
        }

        if (isNullOrUndefined(this.sourcemap)) {
            this.sourcemap = true;
        }
        if (!this.plugins) {
            this.plugins = async (ctx: NodeActivityContext) => {
                // let cssOptions = await ctx.resolveExpression(this.postcssOption);
                let beforeResolve = await ctx.resolveExpression(this.beforeResolve);
                let sourcemap = await ctx.resolveExpression(this.sourcemap);
                return [
                    ...(beforeResolve || []),
                    // cssOptions ? postcss(ctx.resolveExpression(cssOptions)) : null,
                    resolve({ browser: ctx.body.format === 'umd' }),
                    commonjs(),
                    // ctx.body.format === 'cjs' ? buildin() : null,
                    // ctx.body.annotation ? rollupClassAnnotations() : null,
                    sourcemap ? rollupSourcemaps(isBoolean(sourcemap) ? undefined : sourcemap) : null,
                    // ctx.body.tsconfig ? ts(isString(ctx.body.tsconfig) ? ctx.platform.getCompilerOptions(ctx.body.tsconfig) : ctx.body.tsconfig) : null
                ];
            };
        }
    }

}

#!/usr/bin/env node
import { rm, cp, mkdir } from 'shelljs';
import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import * as program from 'commander';
import { execSync } from 'child_process';
import { isString, isArray, isBoolean } from 'util';
const resolve = require('resolve');
const cliRoot = path.join(path.normalize(__dirname), '../');
const packageConf = require(cliRoot + '/package.json');
const processRoot = path.join(path.dirname(process.cwd()), path.basename(process.cwd()));
process.env.INIT_CWD = processRoot;

let cwdPackageConf = path.join(processRoot, '/package.json');
if (!fs.existsSync(cwdPackageConf)) {
    cwdPackageConf = undefined;
}

function requireCwd(id: string) {
    try {
        return require(resolve.sync(id, { basedir: processRoot, package: cwdPackageConf }));
    } catch (err) {
        // require ts-config/paths or globals
        return require(id);
    }
}

requireCwd('ts-node').register();

if (process.argv.indexOf('scaffold') > -1) {
    process.argv.push('--verbose');
}

program
    .version(packageConf.version)
    .command('init [action]')
    .description('init tsioc project. action is project init type: "activity","pack", "boot", default: tsioc')
    .option('-b, --browser [bool]', 'init browser project or not.')
    .option('-v, --version [string]', 'the version of tsioc to init.')
    .option('--dev [bool]', 'init tsioc with devDependencies.')
    .action((action, options) => {
        if (!cwdPackageConf) {
            execSync('npm init', { cwd: processRoot });
        }

        let packs = ['typescript', 'ts-node', 'tsconfig-paths', 'tslib', 'zone.js', 'bluebird'];
        let initcmds = `${packs.join('@latest ') + '@latest'} `;
        let version = isString(options.version) ? `@${options.version || 'latest'} ` : '@latest ';
        let cmds: string[];
        switch (action) {
            case 'activity':
                console.log(chalk.gray('init activity project...'));
                cmds = [
                    '@tsdi/ioc',
                    '@tsdi/core',
                    '@tsdi/annotations',
                    '@tsdi/aop',
                    '@tsdi/logs',
                    '@tsdi/boot',
                    '@tsdi/activities'
                ];
                if (options.browser) {
                    cmds.push('@tsdi/platform-browser');
                    cmds.push('@tsdi/platform-browser-boot');
                    cmds.push('@tsdi/platform-browser-activities');
                } else {
                    cmds.push('@tsdi/platform-server');
                    cmds.push('@tsdi/platform-server-boot');
                    cmds.push('@tsdi/platform-server-activities');
                }
                initcmds = `npm install ${initcmds} ${cmds.join(version) + version} --save${options.dev ? '-dev' : ''}`;
                console.log(initcmds);
                execSync(initcmds, { cwd: processRoot });
                break;
            case 'pack':
                console.log(chalk.gray('init pack project...'));
                cmds = [
                    '@tsdi/ioc',
                    '@tsdi/core',
                    '@tsdi/annotations',
                    '@tsdi/aop',
                    '@tsdi/logs',
                    '@tsdi/boot',
                    '@tsdi/platform-server',
                    '@tsdi/platform-server-boot',
                    '@tsdi/activities',
                    '@tsdi/platform-server-activities',
                    '@tsdi/pack',
                    '@tsdi/unit',
                    '@tsdi/unit-console'
                ];
                initcmds = `npm install ${initcmds} ${cmds.join(version) + version} --save${options.dev ? '-dev' : ''}`;
                console.log(initcmds);
                execSync(initcmds, { cwd: processRoot });
                break;
            case 'boot':
                console.log(chalk.gray('init boot project...'));
                cmds = [
                    '@tsdi/ioc',
                    '@tsdi/core',
                    '@tsdi/annotations',
                    '@tsdi/aop',
                    '@tsdi/logs',
                    '@tsdi/boot'
                ];
                if (options.browser) {
                    cmds.push('@tsdi/platform-browser');
                    cmds.push('@tsdi/platform-browser-boot');
                } else {
                    cmds.push('@tsdi/platform-server');
                    cmds.push('@tsdi/platform-server-boot');
                }
                initcmds = `npm install ${initcmds} ${cmds.join(version) + version} --save${options.dev ? '-dev' : ''}`;
                console.log(initcmds);
                execSync(initcmds, { cwd: processRoot });
                break;
            default:
                console.log(chalk.gray('init tsioc project...'));
                cmds = [
                    '@tsdi/ioc',
                    '@tsdi/core',
                    '@tsdi/annotations',
                    '@tsdi/aop',
                    '@tsdi/logs'
                ];
                if (options.browser) {
                    cmds.push('@tsdi/platform-browser');
                } else {
                    cmds.push('@tsdi/platform-server');
                }
                initcmds = `npm install ${initcmds} ${cmds.join(version) + version} --save${options.dev ? '-dev' : ''}`;
                console.log(initcmds);
                execSync(initcmds, { cwd: processRoot });
                break;
        }
    });


function requireRegisters() {
    requireCwd('tsconfig-paths').register();
}

function runActivity(fileName, options) {
    const wf = requireCwd('@tsdi/activities');
    // const pk = requireCwd('@tsdi/pack');

    let config;
    if (options.config && isString(options.config)) {
        config = requireCwd(options.config);
    }
    config = config || {};
    if (isBoolean(options.debug)) {
        config.debug = options.debug;
    }

    let md = requireCwd(fileName);
    let activites = Object.values(md);
    if (activites.some(v => wf.isAcitvityClass(v))) {
        wf.Workflow.sequence(...activites.filter(v => wf.isAcitvityClass(v)));
    }
}

function vaildifyFile(fileName): string {
    if (!fileName) {
        if (fs.existsSync(path.join(processRoot, 'taskfile.ts'))) {
            fileName = 'taskfile.ts';
        } else if (fs.existsSync(path.join(processRoot, 'taskfile.js'))) {
            fileName = 'taskfile.js';
        }
    }
    if (!fs.existsSync(path.join(processRoot, fileName))) {
        console.log(chalk.red(`'${path.join(processRoot, fileName)}' not exsists`));
        process.exit(1);
    }
    return path.join(processRoot, fileName);
}


program
    .command('test [files]')
    .description('run activity file.')
    .option('--config [string]', 'config file path.')
    .option('-b, --browser [bool]', 'test browser project or not.')
    .option('--debug [bool]', 'enable debug log or not')
    .action((files, options) => {
        requireRegisters();
        if (isArray(files)) {
            files = files.filter(f => f && isString(f)).map(f => {
                if (/^!/.test(f)) {
                    return '!' + path.join(processRoot, f.substring(1));
                }
                return path.join(processRoot, f)
            })
        } else {
            if (!files || !isString(files)) {
                files = 'test/**/*.ts';
            }
            files = path.join(processRoot, files)
        }
        let unit = requireCwd('@tsdi/unit');
        let reporter;
        if (options.browser) {
            reporter = requireCwd('@tsdi/unit-karma');
        } else {
            reporter = requireCwd('@tsdi/unit-console').ConsoleReporter;
        }
        let config;
        if (isString(options.config)) {
            config = requireCwd(options.config);
        }
        config = config || {};
        if (isBoolean(options.debug)) {
            config.debug = options.debug;
        }
        unit.runTest(files, config, reporter);
    });


program
    .command('run [fileName]')
    .description('run activity file.')
    .option('--activity [bool]', 'target file is activity.')
    .option('--config [string]', 'path to configuration file for activities build')
    .option('--debug [bool]', 'enable debug log or not')
    .allowUnknownOption(true)
    .action((fileName, options) => {
        requireRegisters();
        fileName = vaildifyFile(fileName);
        if (options.activity) {
            runActivity(fileName, options)
        } else {
            requireCwd(resolve.sync(fileName, { basedir: processRoot, package: cwdPackageConf }));
        }
    });

program
    .command('build [taskfile]')
    .description('build the application')
    .option('--boot [bool]', 'target file with Workflow instace to boot activity.')
    .option('-e, --env [string]', 'use that particular environment.ts during the build, just like @angular/cli')
    .option('-c, --clean [bool]', 'destroy the build folder prior to compilation, default for prod')
    .option('-w, --watch [bool]', 'listen for changes in filesystem and rebuild')
    .option('--config [string]', 'path to configuration file for activities build')
    .option('--debug [bool]', 'enable debug log or not')
    .option('-d, --deploy [bool]', 'run deploy activity')
    .option('--verbose [bool]', 'log all messages in list format')
    .option('--closure [bool]', 'bundle and optimize with closure compiler (default)')
    .option('-r, --rollup [bool]', 'bundle with rollup and optimize with closure compiler')
    .allowUnknownOption(true)
    .action((taskfile, options) => {
        requireRegisters();
        taskfile = vaildifyFile(taskfile);
        if (options.boot) {
            requireCwd(taskfile);
        } else {
            runActivity(taskfile, options);
        }
    });

program
    .command('serve [taskfile]')
    .description('spawn the local express server')
    .option('-e, --env [string]', 'use that particular environment.ts during the build, just like @angular/cli')
    .option('-c, --clean [bool]', 'destroy the build folder prior to compilation, default for prod')
    .option('-w, --watch [bool]', 'listen for changes in filesystem and rebuild')
    .option('--config [string]', 'path to configuration file for activities build')
    .option('-d, --deploy [bool]', 'run deploy activity')
    .option('--verbose [bool]', 'log all messages in list format')
    .option('--closure [bool]', 'bundle and optimize with closure compiler (default)')
    .option('-r, --rollup [bool]', 'bundle with rollup and optimize with closure compiler')
    .allowUnknownOption(true)
    .action((taskfile, options) => {
        requireRegisters();
        taskfile = vaildifyFile(taskfile);
        if (options.boot) {
            requireCwd(taskfile);
        } else {
            runActivity(taskfile, options);
        }
    });

// program
//     .command('new [app]')
//     .description('new my-app')
//     .option('--src [string]', 'specify a path to an existing src folder')
//     .option('--skip-install [bool]', 'prevents install during scaffold')
//     .option('--yarn [bool]', 'use yarn instead of npm to install')
//     .action((app, options) => {
//         if (fs.existsSync(path.join(processRoot, app))) {
//             console.log(chalk.red(app + ' already exists'));
//             process.exit();
//         }
//         if (!fs.existsSync(path.join(processRoot, app))) {
//             mkdir(path.join(processRoot, app));
//         }
//         cp(path.join(cliRoot, 'src', 'scaffold', 'root', 'ngr.config.js'), path.join(processRoot, program.new));

//     })
//     .command('g, generate [string]')
//     .description('generate schematics packaged with cmd')
//     .option('--ng [bool]', 'generate angular project')
//     .action((build, options) => {

//     });


program.parse(process.argv);

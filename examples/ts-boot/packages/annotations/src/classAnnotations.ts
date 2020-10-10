import * as ts from 'typescript'
import * as through from 'through2';
import { createFilter } from 'rollup-pluginutils';
import { Plugin } from 'rollup';

declare let Buffer: any;

/**
 * attach class Annotations before typescript ts compile.
 *
 * @export
 * @param {string} [annotationField='classAnnations']
 * @returns
 */
export function classAnnotations() {
    return through.obj(function (file, encoding, callback) {
        if (file.isNull()) {
            return callback(null, file);
        }

        if (file.isStream()) {
            return callback('doesn\'t support Streams');
        }

        let contents: string = file.contents.toString('utf8');
        contents = iocAnnotations(contents);
        file.contents = new Buffer(contents);
        this.push(file);
        callback();
    });
}

function iocAnnotations(contents) {
    // fix typescript '$' bug when create source file.
    contents = contents.replace(/\'\$\'/gi, '"$"');
    let sourceFile = ts.createSourceFile('cache.source.ts', contents, ts.ScriptTarget.Latest, true);
    let eachChild = (node: ts.Node, annations?: any) => {
        if (ts.isClassDeclaration(node)) {
            let className = node.name.text;
            let annations = {
                name: className,
                params: {}
            }

            let oldclass = node.getText();
            ts.forEachChild(node, (node) => eachChild(node, annations));

            let classAnnations = `
                    static getClassAnnations():any  {
                        return ${JSON.stringify(annations)};
                    }
               `;
            let end = oldclass.replace(/\s*$/, '').length - 1;
            contents = contents.replace(oldclass, oldclass.substring(0, end) + classAnnations + oldclass.substring(end));

        } else if (ts.isConstructorDeclaration(node)) {
            if (annations) {
                let paramNames = node.parameters.map(param => {
                    return param.name.getText();
                });
                annations.params['constructor'] = paramNames;
            }
        } else if (ts.isMethodDeclaration(node)) {
            if (annations) {
                let paramNames = node.parameters.map(param => {
                    return param.name.getText();
                });
                let method = node.name.getText();
                annations.params[method] = paramNames;
            }
        }
    }

    ts.forEachChild(sourceFile, eachChild);
    return contents;

}

export interface AnnOptions {
    include?: string | string[];
    exclude?: string | string[];
}

/**
 * rollup class Annotations for ioc.
 *
 * @export
 * @param {*} options
 * @returns
 */
export function rollupClassAnnotations(options?: AnnOptions): Plugin {
    options = options || {};
    const filter = createFilter(options.include, options.exclude);
    return {
        name: 'classAnnations',
        transform(code, id) {
            if (!filter(id) && !/\.ts$/.test(id)) {
                return null
            }
            return new Promise((resolve) => {
                try {
                    resolve({
                        code: iocAnnotations(code),
                        map: null
                    });
                } catch (err) {
                    // istanbul ignore else
                    if ('position' in err && this.error) {
                        this.error(err.message, err.position)
                    } else {
                        throw err
                    }
                }
            });
        },
    }
}

// const STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
// const ARGUMENT_NAMES = /([^\s,]+)/g;
// function getParamNames(func: Function | string) {
//     if (!isFunction(func) || isString(func)) {
//         return [];
//     }
//     let fnStr = func.toString().replace(STRIP_COMMENTS, '');
//     let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
//     if (result === null) {
//         result = [];
//     }
//     return result;
// }

# packaged @tsdi/annotations

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/tsioc).
Please file issues and pull requests against that repo.

typescript class annotations is a solution for typescript class compile to es5 uglify.  for project used tsioc to es5 uglify.

## Install

You can install this package either with `npm`.

### npm

```shell

npm install @tsdi/annotations --save-dev

```

## Demo

```ts
import { classAnnotations } '@tsdi/annotations';
const ts = require('gulp-typescript');
gulp.src('src/**/*.ts')
    .pipe(classAnnotations())
    .pipe(ts)

```

## Demo for pack build

```ts
@Pack({
    baseURL: __dirname,
    src: 'src',
    clean: 'lib',
    test: 'test/**/*.spec.ts',
    assets: {
        ts: { dest: 'lib', annotation: true, uglify: false }
    }
})
export class AnnoBuilder {
}


```

```shell
pk build [taskfile.ts]
```

https://github.com/zhouhoujun/tsioc.git

## Documentation

Documentation is available on the
[@tsdi/annotations docs site](https://github.com/zhouhoujun/tsioc).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)
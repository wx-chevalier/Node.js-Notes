# packaged @tsdi/components

This repo is for distribution on `npm`. The source for this module is in the
[main repo](https://github.com/zhouhoujun/tsioc).

`@tsdi/boot`： DI Module manager, application bootstrap. base on AOP, Ioc container, via `@tsdi/core`.

version 5+ of [`@ts-ioc/core`](https://www.npmjs.com/package/@ts-ioc/core) [`tsioc`](https://www.npmjs.com/package/tsioc)
# Install

```shell

npm install @tsdi/components

```

## components
*  `@Component`  Component decorator,  use to defaine class as component with template.
*  `@Input` Input decorator, use to define property or param as component binding field or args.
*  `@Output` Output decorator, use to define property or param as component output field or args.
*  `@RefChild` RefChild decorator, use to select child element and inject to the property in component.

see [ activity build boot simple](https://github.com/zhouhoujun/tsioc/blob/master/packages/activities/taskfile.ts)



## Container Interface

see more interface. all document is typescript .d.ts.

* [IMethodAccessor](https://github.com/zhouhoujun/tsioc/blob/master/packages/core/src/IMethodAccessor.ts).
* [IContainer](https://github.com/zhouhoujun/tsioc/blob/master/packages/core/src/IContainer.ts)
* [LifeScope](https://github.com/zhouhoujun/tsioc/blob/master/packages/core/src/LifeScope.ts)

Documentation is available on the
[@tsdi/core docs site](https://github.com/zhouhoujun/tsioc).

## License

MIT © [Houjun](https://github.com/zhouhoujun/)
# Monorepo

monorepo 是把多个项目的所有代码放到一个 git 仓库中进行管理，多个项目中会有共享的代码则可以分包引用。整个项目就是有 root 管理的 dependencies 加上多个 packages，每个 package 也可以在自己的作用域引入自己的 dependencies。

项目结构如下：

```s
.
├── node_modules
├── package.json
├── packages
│ ├── ui
│ ├── utils
│ └── web
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── readme.md
└── tsconfig.json
```

packages 文件夹中的就是原本每个独立的项目(下文称之为 package )了，现在放在一起用 workspace 去管理。最外层路径称之为 root。在 root package.json 中的 deps 是所有子 package 共用的。

> 源码参考《[web-examples/pnpm](https://github.com/wx-chevalier/web-examples?q=)》

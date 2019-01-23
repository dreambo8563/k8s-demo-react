## Setup

[![Greenkeeper badge](https://badges.greenkeeper.io/dreambo8563/k8s-demo-react.svg)](https://greenkeeper.io/)

```
$ npm install
```

## Running

```
$ npm start
```

## Build

```
$ npm run build
```

## Rules:

全局 css /src/assets/main.css

## Router 命名规则

/系统/模块/页面../:id 等前面 3 层要确定,为了左侧导航能够相应变化

## 路由定义在

/src/app/routers

## store 定义

/src/app/stores

* AppStore 存储应用级别的数据 如 loading
* RouterStore 针对组件中需要应用路由是注入

- 其他: 为需要进行组件通信时的页面级别数据

## 容器类组件

/src/app/containers

* 不同页面的最外层组件结构 同 系统 -> 模块 -> 页面如 sales -> orders -> List 页面

#layouts
存放大型布局的容器组件

* SidebarLayout 所有系统内部要展示左侧导航的布局

## 组件库

/src/app/components

不同模块组件需建立自己的目录 如 Module1 下的 component1 建立 index.tsx 和 style.css

不同模块间通用组件直接放在 Common 目录下

## constants

* stores - store 名字
* text 所有文字 -便于以后国际化,统一处理
* api - 所有 api
* url - 路由地址相关

## utils 帮助函数

* 请求相关
* loadComponentXXX 异步加载组件

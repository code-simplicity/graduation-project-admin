<h1 align="center">水运工程仿真实验后台管理系统</h1>
<p align="center">
    <a href="https://github.com/vuejs/vue-next">
        <img src="https://img.shields.io/badge/vue3-3.1.2-brightgreen.svg" alt="vue">
    </a>
    <a href="https://github.com/element-plus/element-plus">
        <img src="https://img.shields.io/badge/elementPlus-1.0.2-beta.svg" alt="element-plus">
    </a>
    <a href="https://github.com/vitejs/vite">
        <img src="https://img.shields.io/badge/vite-2.3.7-brightgreen.svg" alt="vite">
    </a>
    <a href="https://github.com/microsoft/TypeScript">
        <img src="https://img.shields.io/badge/typescript-4.1.3-brightgreen.svg" alt="typescript">
    </a>
    <a href="https://github.com/hsiangleev/element-plus-admin/blob/master/LICENSE">
        <img src="https://img.shields.io/github/license/mashape/apistatus.svg" alt="license">
    </a>
</p>

## 简介

- # 水运工程仿真实验后台管理系统

  该系统共分为五个模块，分别是首页、用户管理、视频管理、图片管理和内容管理，其中首页展示一些系统的主要信息，比如一些学生成绩排行榜，学生成绩分析图等，用户管理主要是实现学生信息的添加，学生信息的批量导入等，视频管理主要实现视频传入服务器保存，并且将字段存入数据库，从而查看视频，图片管理总共分为4个小模块，这里就不再赘述，内容管理实现的是页面内容的展示以及点位图表的设置。

## 预览

- [demo](http://localhost:3002/#/dashboard)

## 基础模板
## 介绍

水运工程仿真实验后台管理系统是本人毕设项目的后台管理系统，该系统采用vue3，vuex，vue-router，vite,scss构建而成，具备一个企业级的后台项目管理。

#### 特色功能

- 适合中后台开发的路由配置、状态管理机制（状态默认支持本地存储）、已封装完善的axios及api管理机制
- 极方便扩展的主题配置功能，默认支持三种典型的中后台风格
- 简易配置的页面缓存功能，只需配置noCache属性，无需配置其他的任何属性，如组件名称，路由名称等等很多框架需要配置的东西
- 典型增删改查的三种业务表格，详情请查看“页面栏目”内的“业务表格”、“分类联动表格”、“树联动表格”
- 无路由跳转的刷新功能，支持缓存页面刷新，目前了解的多数框架都不支持缓存页面的刷新
- 方便扩展的国际化解决方案，并提供了两套非国际化的基础模板和两套国际化的基础模板（ts版本/js版本）
- 手写版本的各类自定义指令
- 已经过多个中后台业务检验过的表格公用组件及弹窗公用组件，详情请查看“页面栏目”内的“业务表格”、“分类联动表格”、“树联动表格”

#### 主要技术栈

- MVVM框架：vue v3
- 工程化管理：vite v2
- UI框架：element-plus
- 路由管理：vue-router v4
- 状态管理：vuex v4
- 数据请求：axios
- 实用工具库：@vueuse/core

## 效果预览

## 使用

1. 获取源码资源包

   ```sh
   git clone https://github.com/dpy0912/graduation-project-admin.git
   ```

2. 安装依赖，国内推荐使用cnpm或tyarn，国外推荐使用npm或yarn

   ```sh
   yarn add / npm install
   ```

3. 运行

   ```sh
   yarn dev / npm run dev
   ```

4. 打包

   ```sh
   yarn build
   ```

## 项目部署方式

本项目采用linux服务器部署在docker集群，通过编写`Dockerfile`文件以及`docker-compose.yml`文件进行配置，具体配置如下。

### Dockerfile

```sh
FROM node:15.9.0

ENV NODE_ENV=production

RUN mkdir -p /graduationProjectAdmin

COPY . /graduationProjectAdmin

WORKDIR /graduationProjectAdmin

RUN npm config set registry "https://registry.npm.taobao.org/" \
    && npm install --legacy-peer-deps

RUN npm install vite -g

EXPOSE 3333

CMD ["npm", "run", "dev"]
```

运行该`Dockerfile`文件

```sh
docker build -t project-admin-1.0 .
```

### docker-compose.yml

构建镜像。

```sh
version: '2.0'
services:
  project-admin:
    restart: always
    image: project-admin-1.0
    container_name: project-admin
    ports:
      - 3333:3333
```

启动容器，这样就可以部署成功管理端项目了。

然后通过nginx进行域名映射，做代理 ，这里我们设置的域名看后期生产环境的部署。


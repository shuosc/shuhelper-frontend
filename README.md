# shuhelper-frontend

由于不可抗力因素，原先好用又好看的shuhelper v4的很多功能阵亡了。 v5又因为技术栈选择的原因，难以进展。所以我们重新设计了整套校园解决方案，具有低耦合，易上手的开发特性。

可用服务地址： https://cloud.shuosc.com/shuhelper/

## 简介

SHUhelper将是一个服务于**学生**的，符合**教师学校**需求的**安全**的开源信息服务平台。我们将尽力保护所有个人隐私，所有的学生个人信息认证全部通过学校提供的登录接口来鉴权。

这个仓库是对于SHUhelper的项目的整体描述和前端的代码。

## 目标

- 给同学们一个智能的可用的好用的课程表，作业记录与共享等课内需求的24小时非校园网解决方案。
- 提供符合相关法律法规的校内交流与信息发布平台
- 让更多的同学参与开源软件的事业
- ...

## 目前实现的功能

- 校历假期判断
- 当前时间课程提醒
- 精确到天的课程表服务
- 多种算法的个人作业/代码/报告/研讨代办事项管理
- 白天，夜间模式

## 工作中的功能

- 格式化的课程表
- 空教室查询

## How to contribute

1. 加SHU开源社区的QQ群（24061199）询问
2. 前端：咨询 @longfangsong
3. 后端：咨询 @longfangsong
4. 运维：咨询 @longfangsong / @zhoudian64
5. 宣发：咨询 @zhoudian64

## 技术栈

### 后端

后端语言不限，能以HTTP形式暴露出服务接口即可，Java除外，**绝对禁止**使用Java。

目前大部分微服务为Go语言写成。

### 前端

- 前端框架：[Vue.js](https://cn.vuejs.org)

  同时使用了官方推荐的状态管理框架 [Vuex](https://vuex.vuejs.org)、官方推荐的Ajax请求库 [axios](https://github.com/axios/axios)。

- UI框架：[Vuetify](https://vuetifyjs.com/zh-Hans/)

- 主要语言：[TypeScript](https://www.typescriptlang.org)

  同时还使用了 [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) 和 [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/pages/overview.html) 来让 Vue in ts 能写得更爽。

- 其他一些用到的库有：

  - [date-fns](https://date-fns.org)：用于处理日期时间
  - [fp-ts](https://gcanti.github.io/fp-ts/)：主要使用其中的Option Monad
### 数据库
- [PostgreSQL](https://www.postgresql.org)
- [Redis](https://redis.io)

### 部署

- [k3s](https://k3s.io)

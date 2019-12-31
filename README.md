# shuhelper-frontend

可用服务地址： https://cloud.shuosc.com/shuhelper/

## 简介

SHUhelper将是一个服务于**学生**的，符合**教师学校**需求的**安全**的开源信息服务平台。我们将尽力保护所有个人隐私，所有的学生个人信息认证全部通过学校提供的登录接口来鉴权。

这个仓库是对于SHUhelper的项目的前端的代码。项目介绍见[SHUHelper](https://github.com/shuosc/shuhelper/)

## 前端

- 前端框架：[Vue.js](https://cn.vuejs.org)

  同时使用了官方推荐的状态管理框架 [Vuex](https://vuex.vuejs.org)、官方推荐的Ajax请求库 [axios](https://github.com/axios/axios)。

- UI框架：[Vuetify](https://vuetifyjs.com/zh-Hans/)

- 主要语言：[TypeScript](https://www.typescriptlang.org)

  同时还使用了 [vue-property-decorator](https://github.com/kaorun343/vue-property-decorator) 和 [vuex-module-decorators](https://championswimmer.in/vuex-module-decorators/pages/overview.html) 来让 Vue in ts 能写得更爽。

- 其他一些用到的库有：

  - [date-fns](https://date-fns.org)：用于处理日期时间
  - [fp-ts](https://gcanti.github.io/fp-ts/)：主要使用其中的Option Monad

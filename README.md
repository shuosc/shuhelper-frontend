# shuhelper-frontend

由于不可抗力因素，原先好用又好看的shuhelper v4的很多功能阵亡了。 v5又因为技术栈选择的原因，难以进展。所以我们重新设计了整套校园解决方案，具有低耦合，易上手的开发特性。

可用服务地址： https://cloud.shuosc.com/shuhelper/

## 简介

SHUhelper将是一个服务于**学生**的，符合**教师学校**需求的**安全**的开源信息服务平台。我们将尽力保护所有个人隐私，所有的学生个人信息认真全部会通过学校提供的登录接口来坚定权限。

这个仓库是对于SHUhelper的项目的整体描述和前端的代码。

## 目标

- 给同学们一个智能的可用的好用的课程表，作业记录与共享等课内需求的24小时非校园网解决方案。
- 提供符合相关法律法规的校内交流与信息发布平台
- 让更多的同学参与开源软件的事业
- ...

## 目前实现的功能

- 校历假期判断
- 当前事件课程提醒
- 精确到天的课程表服务
- 多种算法的个人作业/代码/报告/研讨代办事项管理
- 白天，夜间模式

## 工作中的功能

- 校历性能调优
- 格式化的课程表
- 空教室查询

## How to contribute

1. 加SHU开源社区的QQ群（24061199）询问
2. 前端：咨询@longfangsong
3. 后端：咨询@longfangsong
4. 运维：咨询@longfangsong / @zhoudian64
5. 宣发：咨询@zhoudian64

## 技术栈

### 后端
    go, 或者任何单一微服务使用的语言。

### 前端
    vueJS, TypeScript
    
### 数据库
    Redis, PostgreSQl

### 部署
    k3s(lite k8s provided by Rancher), ubuntu 16.04 server, aliyun

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

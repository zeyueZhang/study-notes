# 微前端

## 什么是微前端
微前端是一种利用微件拆分来达到工程拆分治理的方案，可以解决工程膨胀、开发维护困难等问题。在前端一体化的大背景下，利用技术手段达到业务层应用聚合、技术层应用自治的工程架构方案，实现一个功能丰富且强大的前端应用。

## 微前端的价值
- **无关技术栈**：主框架不限制子应用的技术栈，子应用具备完全自主权
- **独立开发、独立部署**： 子应用仓库独立，前后端可独立开发，部署完成后主框架自动完成同步更新
- **独立运行时**：每个子应用之间状态隔离，运行时状态不共享

## 业务背景
管理后台的框架陈旧、升级困难，开发工作局限性比较大。由于参与的人员、团队的增多、变迁等因素，该后台逐渐庞大，随之而来的是应用的维护困难等问题。针对后台的框架升级，依赖多升级困难，成本较高。

## 解决方案
- **单实例**：即同一时刻，只有一个子应用被展示，子应用具备一个完整的应用生命周期。通常基于 url 的变化来做子应用的切换。

- **多实例**：同一时刻可展示多个子应用。通常使用 Web Components 方案来做子应用封装，子应用更像是一个业务组件而不是应用。

## 行业现状
MPA 方案的优点在于 部署简单、各应用之间硬隔离，天生具备技术栈无关、独立开发、独立部署的特性。缺点则也很明显，应用之间切换会造成浏览器重刷，由于产品域名之间相互跳转，流程体验上会存在断点。

SPA 则天生具备体验上的优势，应用直接无刷新切换，能极大的保证多产品之间流程操作串联时的流程性。缺点则在于各应用技术栈之间是强耦合的。

微前端则是 MPA 和 SPA 的优势的结合
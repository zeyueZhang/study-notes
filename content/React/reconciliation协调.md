## reconciliation协调

### diff算法
算法复杂度O(n)

### diff策略

1. 同级比较
2. 拥有不同类型的两个组件将会生成不同的树形结构
3. 开发者通过 key prop 来暗示哪些子元素在不同的渲染下能保持稳定

### diff过程
删除、替换和更新
vnode: 现在的虚拟dom    newVnode: 新的虚拟dom

删除：newVnode不存在时
替换：vnode和newVnode类型不同或key不同时
更新：有相同类型和key，但是vnode和newVnode不同时

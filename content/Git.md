
## 简单
- git add .
- git checkout xx
- git commit -m "XX"
- git push origin master
- git pull origin master
- git diff XXX
- git log
- git show log版本号

## 高级

- git stash 将修改的内容暂存
- git stash pop 将暂存的修改推出

### 分支

> 分支是为了将修改记录的整体流程分叉保存, 分叉后的分支不受其他分支的影响, 所以在同一个项目里面可以进行多个修改

![img](../assets/Git/GitBranch.jpg)

分支可以进行花里胡哨的合并

所以, 项目里面都是建立自己的分支, 然后修改, 合并(一般是技术leader去合并)

![img](../assets/Git/GitMerge.jpg)

### 切换分支

checkout 执行切换分支的操作

Head 的概念是现在使用分支中的最后一次更新

> 提交时使用~(tilde)和^(caret)就可以指定某个提交的相对位置。最常用的就是相对于HEAD的位置。HEAD后面加上~(tilde）可以指定HEAD之前的提交记录。合并分支会有多个根节点，您可以用^(caret) 来指定使用哪个为根节点。

Stash 就是还未提交的修改文件, 在切换分支时修改内容会从原分支转移到目标分支

> 但是如果目标分支对该文件也有修改, 就会切换失败

切换失败可以先提交修改内容, 或者使用 stash 暂存修改文件



### 分支的合并

合并分支有两种方法, merge 和 rebase, 结果可能相同, **但是提交记录会有很大差别**

#### merge

merge合并操作有两种情况

1. 目标分支在切分支后没有进行修改, 这样就会很简单的合并
2. 目标分支在切换分支后有修改, 那么 git 就会把两个分支的修改合并起来(如果两个分支的修改有同一个文件的同一行, 就会发生冲突), 然后自动进行一个提交, Head 移动到该提交上

merge 的历史记录因为不会跟着合并, 每一个分支的历史记录还在该分支上, 所以会比较复杂

### rebase

rebase 源分支到分目标分支, 源分支的历史记录会添加在目标分支的后面。

> - 在topic分支中更新merge分支的最新代码，请使用rebase。
> - 向merge分支导入topic分支的话，先使用rebase，再使用merge。






---
layout: post
category: tech
tags: Git 效率 开源
title: 阅读开源代码小技巧：Git历史记录快速翻页式签出
---

通过阅读源码来学习开源项目是最直接也最有效的方法。而想要了解一个开源项目，最好是从第一个commit开始看起，特别是第一个最小可用版本发布前的commits，通过阅读对每一次commit提交源码，能够最直接的理解作者的设计思路和开发过程中的思考。

在GitHub的repository页面上可以很方便的看到所有历史记录及其演进。不过，使用IDE或有跳转功能的编辑器来阅读会更方便。这就需要我们将代码仓Clone到本地。

Clone下来的开源Git仓，想要签出第一次commit也简单：通过 `git log --reverse` 倒序展示log，排在第一个的即是第一次commit，拷贝commit sha值，然后 `git checkout commit_sha` 便可以签出该commit的代码。

当我们想继续跟着作者的节奏看接来下开发的内容，便需要再次show log，并找出下一次的commit sha值，如果commit记录很多，找起来就不那么容易了。因此我在看git代码历史的时候想，能不能将git commits历史记录当成像网站页面一样可以分页查看呢，通过简单的上翻下翻命令来checkout到各commit节点的代码。

其实也不难，无非是用管道将上面提到的命令串起来，写成shell可执行文件放到git安装的bin目录即可。签出第一次Commit节点代码的shell脚本如下：（通过 `git log --reverse --pretty=%H` 可以将log记录倒序并只显示sha值，然后通过args获取管道输出checkout。）

``` bash
#!/bin/sh

first() {
	branch=refs/heads/master
	git log --reverse --pretty=%H $branch | head -1 | xargs git checkout 
}
first
```

将它存为 `git-first` 可执行文件，放到git安装的bin目录（Linux、Mac或Windows皆可）。在git仓中执行 `git first` 即可checkout出第一次commit节点的代码。

签出当前commit记录的下一个节点代码要稍微复杂些，不过也就是多了些命令的组合，stackoverflow搜一下就能找到。通过 `git rev-parse HEAD` 可获取当前工作区代码的commit sha值，然后用 `grep -A` 找出倒序log后当前commit sha值的后一条记录，得到sha值后进行Checkout操作。`git-next` 的脚本如下：

``` bash
# git-next

next() {
	branch=refs/heads/master
	git log --reverse --pretty=%H $branch | grep -A 1 $(git rev-parse HEAD) | tail -1 | xargs git checkout
}
next
```

同样的，签出最后一条记录(`git-last`)和上一条记录(`git-prev`)也可以通过命令组合来实现。我还增加可选参数，可以一次上翻/下翻 n条commit。四个脚本的源码放在了[GitHub Gist](https://gist.github.com/hutusi/e4f32e2bcd8d53ec86de8254ab0d5127)上。  

在查看git仓库源码时便可以通过 `git next`, `git prev` 来轻松逐个commit进行checkout了。也可以通过 `git next 5` 来签出当前commit依次往后第5条commit的代码。 通过`git first`, `git last` 来签出第一条commit及最后一条节点的代码。

于是，拿到一份开源代码后，我便首先通过 `git first` 签出第一次commit的代码，然后通过 `git next` 逐个commit进行阅读。为了快速了解commit之间的差异，可以通过执行 `git diff HEAD^ HEAD` 来了解当前commit改了哪些内容。（嫌每次执行diff命令太长，可以设置alias: `git config --global alias.df 'diff HEAD^ HEAD'`。这样，每次仅需执行 `git df` 便可以快速浏览差异了。）

在调试脚本时发现一个问题，shell中的函数如果写上`function`在Ubuntu等Linux上反倒执行会报错。比如`first() {...}` 写成 `function first() {...}`. 执行时会报 `syntax error: "(" unexpected.` 的错误。上网查了一下，了解到在某些Linux发行版上 `sh` 指向 `dash`，不识别 `function` 标志符。 解决办法是要么将脚本的执行器改成 `bash` ，或直接将 `function` 去掉，这也是能兼容多种shell的最好方式。

最后再附一遍脚本地址，如果你觉得有用，请加star： [https://gist.github.com/hutusi/e4f32e2bcd8d53ec86de8254ab0d5127](https://gist.github.com/hutusi/e4f32e2bcd8d53ec86de8254ab0d5127)

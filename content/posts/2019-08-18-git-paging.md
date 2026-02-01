---
layout: post
category: tech
tags: Git 效率 开源 工具
title: 阅读开源代码小技巧
subtitle: Git历史记录快速翻页式签出
gh_issue: 41
redirect_from:
  - /blog/2019/08/18/git-paging
  - /git-paging
image: articles/2019-git-tips.jpg
---

通过阅读源码来学习开源项目是最直接也最有效的方法。而想要了解一个开源项目，最好是从第一个 commit 开始看起，特别是第一个最小可用版本发布前的 commits, 通过阅读对每一次 commit 提交源码，能够最直接的理解作者的设计思路和开发过程中的思考。

在 GitHub 的 repository 页面上可以很方便的看到所有历史记录及其演进。不过，使用 IDE 或有跳转功能的编辑器来阅读会更方便。这就需要我们将代码仓 Clone 到本地。

Clone 下来的开源 Git 仓，想要签出第一次 commit 也简单：通过 `git log --reverse` 倒序展示 log,排在第一个的即是第一次 commit, 拷贝 commit sha 值，然后 `git checkout commit_sha` 便可以签出该commit的代码。

当我们想继续跟着作者的节奏看接来下开发的内容，便需要再次 show log, 并找出下一次的 commit sha 值，如果 commit 记录很多，找起来就不那么容易了。因此我在看 git 代码历史的时候想，能不能将 git commits 历史记录当成像网站页面一样可以分页查看呢，通过简单的上翻下翻命令来 checkout 到各 commit 节点的代码。

其实也不难，无非是用管道将上面提到的命令串起来，写成 shell 可执行文件放到 git 安装的 bin 目录即可。签出第一次 Commit 节点代码的 shell 脚本如下：（通过 `git log --reverse --pretty=%H` 可以将 log 记录倒序并只显示sha值，然后通过 args 获取管道输出 checkout.）

``` bash
#!/bin/sh

first() {
	branch=refs/heads/master
	git log --reverse --pretty=%H $branch | head -1 | xargs git checkout 
}
first
```

将它存为 `git-first` 可执行文件，放到 git 安装的 bin 目录（Linux、Mac 或 Windows 皆可）。在 git 仓中执行 `git first` 即可 checkout 出第一次 commit 节点的代码。

> Windows 的 Git 一般安装在 `C:\Program Files\Git` 下，bin 目录非根目录下的 bin, 而是在 usr/bin 下，直接将 git-first 等文件拷贝至该目录即可。（注意：该目录原来有 git-flow 等文件。）

签出当前 commit 记录的下一个节点代码要稍微复杂些，不过也就是多了些命令的组合, stackoverflow 搜一下就能找到。通过 `git rev-parse HEAD` 可获取当前工作区代码的 commit sha 值，然后用 `grep -A` 找出倒序 log 后当前 commit sha 值的后一条记录，得到 sha 值后进行 Checkout 操作。`git-next` 的脚本如下：

``` bash
# git-next

next() {
	branch=refs/heads/master
	git log --reverse --pretty=%H $branch | grep -A 1 $(git rev-parse HEAD) | tail -1 | xargs git checkout
}
next
```

同样的，签出最后一条记录(`git-last`)和上一条记录(`git-prev`)也可以通过命令组合来实现。我还增加可选参数，可以一次上翻/下翻 n条 commit. 四个脚本的源码放在了[GitHub](https://github.com/hutusi/git-paging)上。

在查看 git 仓库源码时便可以通过 `git next`, `git prev` 来轻松逐个 commit 进行 checkout 了。也可以通过 `git next 5` 来签出当前 commit 依次往后第5条 commit 的代码。 通过`git first`, `git last` 来签出第一条 commit 及最后一条节点的代码。

于是，拿到一份开源代码后，我便首先通过 `git first` 签出第一次 commit 的代码，然后通过 `git next` 逐个 commit 进行阅读。为了快速了解 commit 之间的差异，可以通过执行 `git diff HEAD^ HEAD` 来了解当前 commit 改了哪些内容。（嫌每次执行 diff 命令太长，可以设置 alias: `git config --global alias.df 'diff HEAD^ HEAD'`。这样，每次仅需执行 `git df` 便可以快速浏览差异了。）

在调试脚本时发现一个问题, shell 中的函数如果写上`function`在 Ubuntu 等 Linux 上反倒执行会报错。比如`first() {...}` 写成 `function first() {...}`. 执行时会报 `syntax error: "(" unexpected.` 的错误。上网查了一下，了解到在某些 Linux 发行版上 `sh` 指向 `dash`，不识别 `function` 标志符。 解决办法是要么将脚本的执行器改成 `bash` ，或直接将 `function` 去掉，这也是能兼容多种 shell 的最好方式。

最后再附一遍脚本地址，如果你觉得有用，请加 star: [hutusi/git-paging](https://github.com/hutusi/git-paging)，提 issue 或 pr 帮助改进。 [^1]

************

[^1]: 之前脚本源码放在 gist (https://gist.github.com/hutusi/e4f32e2bcd8d53ec86de8254ab0d5127)上，但 gist 管理批量源码不太方便，且有时访问不了，因此移到 repos 中管理，也方便提 issue 或 pr.

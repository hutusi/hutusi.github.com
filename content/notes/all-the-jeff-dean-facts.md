---
title: 关于 Jeff Dean 的段子
date: '2026-08-07'
tags: []
aliases: []
---
## 算法与时间复杂度

- Jeff Dean 觉得常数级复杂度 $O(1)$ 还是太慢了，于是他发明了世界上第一个 $O(1/n)$ 时间复杂度的算法。
- Jeff 曾经把一个函数优化到了极致，以至于**它在被调用之前就返回了结果**——为了解决这个问题，他不得不发明了异步 API。
- Jeff Dean 也是一次穿一条裤腿；但如果他有两条以上的腿，你会发现他的穿裤子算法时间复杂度是 $O(\\log n)$。
- 当被问到 $P=NP$ 是否成立时，Jeff 仅用多项式时间在白板上解出了所有 NP 问题，证明了 $P=NP$（顺便说一句，对 Jeff 来说，“NP”的意思是 “No Problemo”）。

## 编译器、硬件与底层

- 在谷歌使用 `gcc -O4` 编译选项时，系统不会做优化，而是**直接把你的代码发送到 Jeff Dean 的邮箱里让他重写**。
- Jeff Dean 曾经有一次位移（Bit Shift）操作用得太猛，直接把一个 Bit 移到了另一台计算机上。
- Jeff Dean 编写软件时，会先直接手写二进制代码，然后再写一套 C++ 源码作为给其他普通程序员看的“文档”。
- 普通程序员的代码出现未定义行为（Undefined Behavior）时会发生内存段错误（Segmentation Fault）；而 Jeff Dean 的代码出现未定义行为时，天空会划过彩虹，独角兽会过来给每个人发免费冰淇淋。
- 编译器从来不敢向 Jeff Dean 报 Warning，是 Jeff Dean 警告编译器。

参考：

\* <https://www.quora.com/What-are-all-the-Jeff-Dean-facts>

\* <https://github.com/LRitzdorf/TheJeffDeanFacts>
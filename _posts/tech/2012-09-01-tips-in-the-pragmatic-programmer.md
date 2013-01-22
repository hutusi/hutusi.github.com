---
layout: post
category: tech
tags: [programmer]
title: 《程序员修炼之道》笔记
---

《The Pragmatic Programmer》中提出了一些建议，记录如下：


## Tip 1: Care About Your Craft

## Tip 2: Think! About Your Work

两条总纲性的建议，不断修炼自己的技艺，勤思考。

## Tip 3: Provide options, don't make lame excuses

出了事故，不要找借口推脱责任，不要说"The cat ate my source code"。

## Tip 4: Don't live with Broken Windows

破窗理论，糟糕的代码只会越来越糟。

## Tip 5: Be a catalyst for change

“石头汤”的故事告诉我们，面对糟糕的境况，需要做些改变；改变并不难，有时候仅仅需要一点催化剂(catalyst)。

## Tip 6: Remember the Big Picture

Make change! 不要像温水煮青蛙。

## Tip 7: Make quality a requirements issue

把质量当成需求的一部分。

## Tip 8: Invest regularly in your knowledge portfolio

投资学习和投资资产很相像，它们都要多样化(diversify), 风险管理(manage risk, 不要把鸡蛋都放在一个篮子里。)，低买高售(buy low, sell high. 在新技能刚面世的时候去学习比已成熟后收益高。)，及时调整(review and rebalance, 技能有可能过时，要及时调整学习计划。)

个人感觉这一条过于功利。

## Tip 9: Critically analyze what you read and hear

Critical thinking, 这也是针对技能学习的。

## Tip 10: It's both what you say and the way you say it

与人沟通也是一项重要的技能。

## Tip 11: DRY -- Don't Repeat Yourself

不解释。

## Tip 12: Make it easy to reuse

可复用的软件...

## Tip 13: Eliminate effects between unrelated things

正交(orthogonality)是系统设计的一个原则。

## Tip 14: There are no final decisions

唯一不变的是变化，不可能要求需求是不变的，要努力做到的是需求的变化带来的代码的变化最小，需要考虑弹性的设计(Flexible Architecture). 

## Tip 15: Use tracer bullets to find the target

Tracer bullet, 原型(prototype), 区别是什么？...

增量开发? 迭代？

## Tip 16: Prototype to learn

## Tip 17: Program close to the problem domain

使用领域语言(domain language)来解决问题，更聚焦于业务，便于理解。使用代码去创建domain language。

## Tip 18: Estimate to avoid surprises

评估代码量，评估工作量，评估进度...

## Tip 19: Iterate the schedule with the code

利用迭代进度修正计划估算。

## Tip 20: Keep knowledge in plain text

存文本的好处...

## Tip 21: Use the power of command shells

命令行的好处...

## Tip 22: Use a single editor well

One editor, 从一而终...

## Tip 23: Always use source code control 

版本控制的好处...

## Tip 24: Fix the problem, not the blame

修正bug，不要抱怨。

## Tip 25: Don't panic 

遇到bug莫惊慌，bug怕你:)

## Tip 26: "select" isn't  broken

发生在作者身上的一个故事，后来他便用 "selcet" isn't broken 来表示不要责备系统出了故障，而要检查代码是不是有问题。

## Tip 27: Don't assume it -- Prove it

大胆猜测，小心求证。

## Tip 28: Learn a text manipulation language

ruby, python等，结合正则表达式都是文本处理的利器。

## Tip 29: Write code that writes code

代码生成器(code generator)可以帮助节省很多工作量。

## Tip 30: You can't write perfect software

Perfect...

## Tip 31: Design with contracts 

契约式设计(DBC, design by contract)让软件协作开发变得有序，eiffel语言提供了很好的语法机制保护这种协定。

## Tip 32: Crash early

Dead programs tell no lies.

## Tip 33: If it can't happen, use assertions to ensure that it won't 

assert的用法。什么时候应该用assert？什么时候不该？

## Tip 34: Use exceptions for exceptional problems

exception的用法。什么时候应该用exception？什么时候不该？

## Tip 35: Finish what you start

使用资源要释放。

## Tip 36: Minimize coupling between modules

迪米特法则(The Law of Demeter)。

## Tip 37: Configure, don't integrate

将数据配置与代码解耦，使用动态数据配置。

## Tip 38: Put abstractions in code, details in metadata

元数据(metadata)是数据的数据(data about data), 如描述数据库的表结构或数据字典。利用元数据可以进行元编程(metaprogramming)。

## Tip 39: Analyze workflow to improve concurrency

并发系统的解耦。

## Tip 40: Design using services

服务，委托...

## Tip 41: Always design for concurrency

## Tip 42: Seperate views from models

MVC模式，publish/subscribe模式...

## Tip 43: Use Blackboards to coordinate workflow

Blackboard模式与publish/subscribe模式的区别？...

## Tip 44: Don't program by coincidence

严谨，严谨...

## Tip 45: Estimate the order of your algorithms

使用O(n)方法评估算法的复杂度:
0. 直接取值（如数组取值）： O(1)
1. 单循环：O(n)
2. 嵌套循环： 如冒泡排序 O(m*n), O(n**2)
3. 二叉树： O(lg(n))
4. 分而治之(divide and conquer), 如快速排序：O(n lg(n))

## Tip 46: Test your estimates

使用一些工具验证算法性能。

## Tip 47: Refactor early, refactor often

不解释。

## Tip 48: Design to test

代码要易于测试。

## Tip 49: Test your software, or your users will

嗯，还是测试。

## Tip 50: Don't use wizard code you don't understand

作者说"Evil wizards", 为什么？

## Tip 51: Don't gather requirements -- dig for them

需求需要挖掘，挖掘。

## Tip 52: Work with a user to think like a user

现场客户。

## Tip 53: Abstractions live longer than details 

## Tip 54: Use a project glossary

统一的术语。

## Tip 55: Don't think outside the box -- find the box

## Tip 56: Listen to nagging doubts -- start when you're ready

## Tip 57: Some things are better done than described

## Tip 58: Don't be a slave to formal methods

## Tip 59: Expensive tools do not produce better designs

## Tip 60: Organize around functionality, not job funcitons

## Tip 61: Don't use manual procedures

一切皆自动化(all on automatic)。

## Tip 62: Test early, test often, test automatically.

自动化测试。

## Tip 63: Coding ain't done 'til all the tests run

没测完不算编码结束。

## Tip 64: Use saboteurs to test your testing

## Tip 65: Test state coverage, not code coverage

## Tip 66: Find bugs once

然后，就应该写到自动化测试里了。

## Tip 67: Treat english as just another programming language

## Tip 68: Build documentation in, don't bolt it on

内部的文档：源码，源码注释...

## Tip 69: Gently exceed yout users' expectations

## Tip 70: Sign your work

Be proud of your work.


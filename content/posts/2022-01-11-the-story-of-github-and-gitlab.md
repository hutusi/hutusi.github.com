---
layout: post
category: tech
tags: 产品 开源 GitHub GitLab Git
title: 从零到百亿美金之路
subtitle: GitHub 和 GitLab 的故事
date: "2022-01-11 23:30:00 +0800"
last_modified_at: "2022-01-11 23:30:00 +0800"
gh_issue: 109
image: posts/github-founders-and-first-employee.jpeg
featured: true
---

TL;DR 本文字数约6000字，全文阅读约10分钟，分为引子、GitHub的故事、GitLab的故事以及启示几个部分。

> 虽然某些技术进步似乎是微不足道的，但是技术的发展不仅体现在重大的飞跃之中，还是由无数个小幅的改进累积而成的。
>
> —— Walter Isaacson 《创新者》

### 引子

2005年，因为 Linux 社区被商业公司撤回了免费试用源码配置管理工具的权利，Linus Torvalds 一怒之下自己花了十天时间开发并发布了分布式源码配置管理工具Git, 虽然当时 Linus 只是想着给 Linux 社区小伙伴们开发个顺手的协作工具，但没想到这款工具将席卷全球，并改变了软件世界。关于 Git 的诞生和源码分析参见拙作[《改变世界的一次代码提交》](https://hutusi.com/articles/the-greatest-git-commit)。我在该文的最后写道：

> 在 Git 诞生后两年，旧金山的一个小酒馆里坐着三位年轻的程序员，决定要用 Git 做点什么，几个月后，GitHub 上线。
> 

原本是打算紧接着写一写 GitHub 的历史的，但拖延症犯了，一拖就是一年多。等到 GitLab 上市了，才想起来应该写点东西了。周末回顾了下 GitHub 和 GitLab 的历史，来聊一聊这两个产品的故事。

### GitHub 的故事

2007年，Tom Preston-Werner 刚刚卖掉上一个创业项目 Gravatar, 开始构建新的想法。他的新项目叫 Grit，这是一个使用 Ruby 语言开发的 Git 组件库，通过 Ruby 封装操作 Git 仓库的接口。那个时候 Ruby 以及 Ruby on Rails 在硅谷很流行，很多前卫的创业公司都会选择 Ruby。Tom 在酒吧里碰到了 Chris Wanstrath 和 PJ Hyett，向他们推销自己的想法并拉他们一起入伙。这便是 GitHub 的开始，而 Tom Preston-Werner, Chris Wanstrath 和 PJ Hyett 也成了 GitHub 的三位创始人。后来他们又找了一名程序员，名叫 Scott Chacon, 负责 Git 接口开发。这哥们很长一段时间一直在简介中写着：第一位 GitHub 员工。是的，GitHub 的初始创业团队里，就是三个老板和一个员工。

![GitHub founders and first employee](posts/github-founders-and-first-employee.jpeg?w=600){:width="600px"}

> GitHub三位创始人(左一: Chris Wanstrath; 左二: Tom Preston-Werner; 右一: PJ Hyett)和第一个员工(右二: Scott Chacon)

不过 GitHub 的三位创始人都是程序员出身，所以老板和员工的区别不大，一起撸代码。Tom Preston-Werner 更是一名极客，GitHub 技术栈上的核心组件基本都是他捣鼓出来的，他还创造了静态博客框架 jekyll，也就是 GitHub Pages 默认的博客框架；以及 Toml(即 Tom’s Language)配置语言，成为了 Rust 语言包 Cargo 的官方配置脚本语言。不过后来 Tom 牵涉进了办公室性别歧视事件，辞去了 GitHub CEO 的职位。Tom辞职后，Chris Wanstrath 接任了 CEO，一直到2018年微软收购 GitHub。

Tom Preston-Werner 回忆他第一次创业，他躺在学校宿舍的床上绞尽脑汁去想有什么创业的机会，但好像互联网上点子都被人实现了。于是又去想有哪些服务可以提供公共 SaaS 服务，比如提供评论服务的 disqus. 他想到每次在网站上注册账号时都要上传头像，于是就做了头像服务 Gravatar，用户只要在 Gravatar 上传头像，那么支持 Gravatar 的网站便可以直接显示用户的头像。但这个服务赚不到钱，一直到卖给 WordPress 后 Tom 才还清了自己的贷款。等到创立 GitHub 时，Tom 就认定首先要把商业模式想清楚，因而 GitHub 在一开始就是提供私有仓库收费服务的。从2008年创立到2012年的四年间，GitHub 从未融过资，在它的官网介绍页面一直自豪的写着0融资。2012年，GitHub 接受了 a16z 的1亿美元投资，2015年再次接受红杉资本2.5亿美元投资，此时估值已达20亿美元。2018年6月，微软宣布以75亿美元收购 GitHub. 

![Microsoft acquires github](posts/microsoft-acquires-github.jpeg?w=600){:width="600px"}

> 微软收购 GitHub 后三位大佬的合影(左: 收购前 GitHub CEO Chris Wanstrath; 中: 微软 CEO Satya Nadella; 右: 收购后 GitHub CEO Nat Friedman)

微软收购 GitHub 可谓是捡了个大便宜，2016年微软收购 Linkedin 时就花了262亿，GitHub 吃亏在被投资界认定为是开发者的 Linkedin. 这是大大低估了GitHub的价值。从可替代性上看，Linkedin 是可以被替代的，而 GitHub 不可替代。从 Linkedin 进入中国（领英）去年又退出可以看出，Linkedin 并没有优势（至少在中国没有优势）；但 GitHub 则不同，GitHub 的不可替代性太强了。扯远了，GitHub 已经成为了全球最大的开发者社区、代码中心和开源软件平台，软件在我们的生活中越来越重要，GitHub 也只会越来越重要。不仅是 Git 成就了 GitHub（Git是GitHub的技术基础），更是 GitHub 让 Git 成为了版本控制管理工具的事实标准。

GitHub 最初的 Slogan 是 “Social coding”(后来改为 Build software better, together, 现在是 Where the world builds software)，因此也认为是程序员版的 Facebook. 在 GitHub 之前，全球最大的开源项目平台是SourceForge, 任何人都可以在上面创建并发布开源软件，但它侧重于开源软件的展示和发布，没有考虑开发者的社交活动。而 GitHub 在面世时就突出开发者社交，最亮点的特性有三个：开发者社交功能、”Fork+Pull Request”、Explore 页面。

![github-social-coding](posts/github-social-coding.jpeg?w=600){:width="600px"}

> GitHub最初的 Slogan: Social coding 以及GitHub的著名Logo章鱼猫 octocat

社交功能主要体现在登录用户的首页和用户 Profile 页面。登录用户首页上以 timeline 状态流的方式呈现与用户关注的用户和项目的动态，感觉就像刷社交媒体一样爽 GitHub。GitHub 的用户 Profile 页面在2012年做过重大调整，这种风格基本保持到了现在。Profile 页面上展示用户的项目和 follow 及被 follow 的数量；后来加上了贡献图，就是那些绿色小格子的日历图，每个勤奋的程序员都想点亮它们。这就成了程序员的最真实的个人名片，因此早在2009年就有人在 Twitter 上提出：对程序员来说，GitHub 比简历和 Linkedin 重要的多。GitHub 非常注重它的社交属性，这是它成功的最主要原因。

![tweet-about-github](posts/tweet-about-github.png?w=480){:width="480px"}

> 早在2009年，Twitter 上就有网友提出 GitHub 比简历更重要

GitHub 第二个亮点特性是“Fork+Pull Request(简称 PR)”，这种开源协作模式充分利用了 Git 的分布式特性。在以往的开源协作模式中，程序员们主要通过邮件+patch的方式来交换代码。而 GitHub 提供的 PR 机制，让程序员在 GitHub 上可以一键 Fork 仓库到自己名下，然后通过提交 PR 来将自己的共享合回社区（或原项目所有者），基于 PR 公开讨论，并决定是否合入主干。这种社区协作的方式让大家觉得很酷，很快 GitHub 就在硅谷的黑客圈子里流行了起来。最开始是 Ruby 社区（因为 GitHub 本身也是用 Ruby on Rails 写的），Ruby on Rails 的创始人 DHH 开始注意到了它，并将 Ruby on Rails 源码托管迁移到了 GitHub。在2014年前的几年里，Ruby 一直是 GitHub 上排名第一的语言。接着，是更多的社区、企业和个人将自己的代码迁移到 GitHub. 当然，不是每个人都喜欢 PR，最大的反对声音来自于 Git 的创始人 Linus Torvalds。Linus 曾直言不讳的批评 GitHub PR 制造了“一堆毫无用处的垃圾合并”。

![linus-criticize-github-pr](posts/linus-criticize-github-pr.jpeg?w=480){:width="480px"}

> Linus 在邮件列表中痛批 GitHub PR

而 Explore 页面稍晚一些，在2010年推出。在拥有了一定数量的用户和项目仓库后，GitHub 开始通过 Explore 页面推荐一些热点(Trending)项目仓库，排名靠前的项目是那些近期 Star 数量飙升的项目。程序员们乐意给中意的项目加”Star”，而被 Star 的项目也有更高的权重被更多的人所知道，这样就让整个 GitHub 社区活跃了起来。如果说 Facebook 的标志性操作是”Like”的话，那么 GitHub 一定非”Star”莫属了。网络的价值，在于网络中连接节点的数量。GitHub 网络中的连接节点就是用户和项目仓库代码，当这种连接数量越来越多时，就会产生规模效应，越来越多的用户加入 GitHub，越来越多的代码被上传。而后 GitHub 又推出了marketplace (原名Integrations), 将第三方软件厂商提供的服务也连接到节点中，GitHub 成了一个连接了全球开发者、代码和服务的社交网络。

虽然 GitHub 后来又增加了项目管理的 Project 功能、CI/CD 功能(GitHub Actions)，看上去似乎是在向 DevOps 平台发展；但本质上，GitHub 仍然是一个社区，并且也在着重打造社区。GitHub 提供更多更全面的服务，也是为了让社区里的用户体验更好。根据 GitHub 发布的报告，GitHub 上已经有7300万开发者用户，其中2021年新增了1600万；托管代码仓超过2亿，仅2021年新增代码仓6100万。

![github-home](posts/github-home.png?w=600){:width="600px"}

> GitHub 首页上的地球动图，当该地区有人提交代码到 GitHub，地球动图的该位置就会被点亮

### GitLab 的故事

GitHub 创始人 Tom Preston-Werner 曾在2011年时写过一篇博文 *Open Source (Almost) Everything*, 他的观点是尽可能多的开源，因为开源可以带来的好处很多，如广告效应、使用社区力量（更多的用户带来更多的应用场景和促进高质量代码）、吸引人才、选拔人才、留住人才、模块化软件架构、减少代码重复等，而且开源本身也是回馈社区的行为。但他认为有些代码是不能开源的，比如那些具有核心商业价值的代码组件。GitHub 在创始人的驱动下，开源了一些组件，如 grit、resque、jekyll、gollum、hubot 等，这让 GitHub 获得了开发者特别是 Ruby 开发者的好感，当时，GitHub 也是最酷的技术公司之一。顺便说一句, Tom 在文章中提到唯一正确的 License(One True License)是 MIT，这也是 GitHub 上创建仓库长期以来默认的 License，以至于MIT很快取代了老牌的 GPL 和 Apache License, 成为了开源社区最为流行的 License. 

几年后，GitLab 也在官网上发布的一篇博客，名为 *Almost Everything We Do Will Be Open*, 在文章中，GitLab 宣称他们将公开所有能公开的东西，包括源码、文档、工作手册、工作讨论交流等，除了涉及隐私或安全相关的内容，能公开的都会公开。虽然 GitHub 开源了很多组件，但他们核心的产品 GitHub 本身是闭源的。而GitLab是完全开源的，用他们自己的话说，这是 Open Core, 即核心开放，这是开源的一种商业模式，产品的核心是开源的，而提供商业收费的增值或附加特性。

The Org 曾发表过一篇专题报道“全世界最透明的公司” (*GitLab: The World’s Most Transparent Company*)，介绍了 GitLab 的公司运作。GitLab 全球1400名员工，分布在全球65个国家，因此远程(Remote)是 GitLab 的基本工作方式。GitLab 按照他们所声称的那样公开了几乎所有的东西，最著名的是他们的员工手册(handbook)，涵盖了公司价值观、内部沟通、开发流程、公司运作，以及如何请假、如何报销等方方面面。这份员工手册如果打印成纸质文档的话，会超过8000页。并不是每位新进 GitLab 的员工都能理解这种透明的文化，刚开始他们会很不习惯被“暴露”在公开社区的工作方式。但很快员工就会习惯，因为透明和开放让协作变得更简单。而透明也有利于流程和效率改进，比如员工手册，一直在持续优化更新。

这种近乎偏执的透明文化让 GitLab 持续保持着创业公司的特质，当然这与公司创始人的黑客风格也是密不可分的。2011年，乌克兰的两个程序员 Dmitriy Zaporozhets 和 Valery Sizov 想做一个能帮助他们团队协作的工具，于是就开发了 GitLab。2011年10月9日，GitLab 发布了第一版并开源了源码，而后，每个月他们都会发布新版本。2012年，荷兰程序员 Sid Sijbrandij 发现了 GitLab，正好他手中握有 GitLab.com 这个域名（Dmitriy发布GitLab时用的是 gitlabhq.com），于是 Sid 和 Dmitriy 一拍即合，决定成立公司来全职投入GitLab。

![gitlab-founders](posts/gitlab-founders.jpeg?w=600){:width="600px"}

> GitLab 的两位创始人（左: Sid Sijbrandij; 右: Dmitriy Zaporozhets）在去年 NASDAQ 上市时的合影

最初，GitLab 是定位为开源的 GitHub（确切的说，是 GitHub Enterprise，也就是可在企业内私有部署的 GitHub 版本）。当时 GitHub Enterprise 的一个License 大约是500美元每人年。因此，功能接近 GitHub 而又开源的 GitLab 开始被越来越多的公司和个人所采用。我在2012年5月在公司搭建了第一个 GitLab 服务，好像是2.5版本，后来几乎每个月我都会升级，因为每个月都能感受到 GitLab 日新月异的变化。从最初仅仅是Git仓库托管，到项目管理功能(issues, milestone)，到借鉴于 GitHub PR 的 Merge Request。实际上，Merge Request 还是有很大的流程性创新的，在 GitLab 的 MR 流程中，无需 Fork 仓库，而是创建分支提交MR，这其实比 GitHub PR 更适合项目内协作。GitHub 后来也将这种无需 Fork 创建分支提 PR 的功能也实现了，可谓是学生教了老师。而 GitLab 的更新迭代非常快，他们也非常积极听取用户特别是企业用户的意见。记得应该是在2013年左右，我发了封邮件(也许是issue)给 GitLab，很快就收到了 Sid 的回复，并约我和 Dmitriy 一起开了个电话会议，我还记得 Sid 在电话会议快结束时说我们三个非英语国家的人分别在三个时区完成了对 GitLab 发展很重要的交流，这是互联网带来的奇迹（我脑洞一下，莫不是从那次会议起 Sid 动了 Remote 工作的念头^_^）。GitLab持续加强企业代码托管及开发协作所需的特性和服务，在 GitLab 之外还发布了持续集成服务 GitLab CI.

2015年初，GitLab 申请成为 Y Combinator 孵化器成员并获得通过。Y Combiantor 是 Paul Graham（即《黑客与画家》的作者）创办的风险投资结构，对投资项目要求极为严格。GitLab 获得 Y Combiantor 投资后整个团队（包括两创始人在内也就5个人）便搬到了硅谷。GitLab 也有了更为清晰的商业路线，加快了扩张，从最初的能装在一辆SUV的团队扩张到了140人。

![gitlab-the-boat](posts/gitlab-the-boat.jpeg?w=600){:width="600px"}

> GitLab 搬到硅谷初期的时候的团队，他们将这辆能塞下整个团队的车称为 Boat

GitLab 发现如果单纯做开源版的 GitHub Enterprise，商业变现比较困难，虽然GitLab 提供了收费的 GitLab EE 版本，但营收一直不是很理想。因为小企业其实部署开源免费的 GitLab CE 版本就够了，而大企业也会优先选择在 GitLab CE 版本上做二次开发和功能增强。因此 GitLab 在加入 Y Combinator 孵化器后，在商业策略上也开始调整，着重打造 GitLab.com SaaS 服务，将 GitLab CI 合入到 GitLab 中，并增加项目管理、CICD、性能安全检测等全链路的DevOps功能。对比 GitLab 和 GitHub 的订阅费可以看出，GitLab 的 Premium 版本每用户每月收费19美元，Ultimate 版本每用户每月 99美元；相对应的 GitHub 的两档收费版本 Team 和 Enterprise 分别是每用户每月 4美元和 21美元。可以说，GitLab 的收费远远高于 GitHub. 而 GitLab之所以有这样的底气，是因为它能给客户提供比 GitHub 更多功能特性的产品，用 GitLab 自己的话说，他们是（唯一的） DevOps 平台(The DevOps Platform, 注意这个 “The”)。当然，这个唯一是GitLab 自己声称的，其实各大云厂商都有自己的DevOps平台。不过仅就比较GitHub而言，确实 GitLab 在 DevOps 能力方面更胜一筹，GitLab 在官网也有与其他工具对比：GitLab = JIRA + GitHub + Jenkins + JFrog + 性能监控 + 安全检查。

![gitlab-compare-to-tools](posts/gitlab-compare-to-tools.png?w=600){:width="600px"}

> GitLab 官网上将自己与其他工具对比

2020年，新冠疫情席卷全球，而提供企业 DevOps 服务的 GitLab 获得了快速发展的机会，成员也增长到了1200人，GitLab 获得了2亿6千万美元的风投，而 GitLab 也开启了它的上市计划。2021年，在 GitLab 创立10周年之际，GitLab 在纳斯达克(NASDAQ)上市，开盘市值冲到150亿美元（目前市值 100亿美元 10.24B）。

从2011年9月在 GitHub 上发布第一个版本，GitLab 每个月都会发布一个新版本，而且基本上都在每月的22日，前后相差不过一两天。十多年如一日，即使 GitLab 体量已经非常大了，还保持着最初版本一样的敏捷迭代效率，真的是令人佩服。而这体现了 GitLab 良好的构架守护。GitLab 最初采用 Ruby on Rails 框架编写，一直是学习 Ruby on Rails 的最好实例样板，代码非常干净整洁，测试用例也很齐全。而后关键性能组件用 Go 重写，前后端分离前端使用 Vue.js 重构。GitLab 一直采用合适的新技术来保持架构的弹性。

![gitlab-loc-curve](posts/gitlab-loc-curve.jpeg?w=600){:width="600px"}

> GitLab 代码量增长曲线

除了透明和敏捷，GitLab 的联合创始人及 CEO Sid Sijbrandij 总结了 GitLab的文化，将它归纳为 CREDIT: 及 Collaboration(开放协作), Results(结果导向), Efficiency(效率优先), Diversity Inclusion and Belonging(多样性、包容及归属感), Iteration(敏捷迭代), Transparency(透明)。从最初的两个创始人到目前全球分布的1400多员工，从最初的一次开源代码提交到现在市值160亿美元的上市企业，GitLab 的故事激励着初创企业和开源社区。可以说，GitLab 是将开源软件的开放、透明文化与商业模式结合最为成功的案例之一。

### 启示

GitHub 和 GitLab 的故事带给我的启发大概有如下几点：

1. **文化是公司或团队最重要的东西。**任总说过：“只有文化才能生生不息。”很多组织的文化是在组织创立后逐渐形成的。一个积极而正向的文化能将优秀的人聚集在一起，所谓物以类聚，人以群分。GitHub 的黑客文化，GitLab 的透明开放文化，都将一批有同样理想和追求的人聚集在了一起，从而创造出优秀的产品。

2. **解决自己遇到的问题，这往往是做好产品的前提。**如果别人也有这个问题，那么商业模式就有了。如果这是个普遍存在的问题，那么这将是个很好的商业模式。GitHub 和 GitLab 在创立初期都是为了解决自己遇到的问题，吃狗粮(eating dog food)，直到发现更广阔的用户场景。关于这一点，可参见 GitHub 员工早期的演讲: *How GitHub Uses GitHub to Build GitHub*.

3. **持续迭代，持续演进，持续更新。**GitLab 可以说将迭代做到了极致，而 GitHub 的更新迭代也是很快的。与之形成对比的是 Gitorious，作为 Git 托管平台，Gitorious 很早就开源了，它的诞生不仅比 GitLab 早，甚至比 GitHub 还早。但 Gitorious 基本上是对标 SourceForge 做的，后期也不怎么更新，最终被 GitLab 所收购。产品如果不及时更新，很快就会被用户所遗忘。

4. **后发产品要想实现超越必须要探索出一条新路，沿着领先竞争对手的路去走只能是跟随。**GitLab 初期是以开源可私有部署的 GitHub 方式而深入人心，因此得到了很多期望以更低成本私有化部署 GitHub 的用户的青睐。后来 GitLab 做代码托管 SaaS 服务 GitLab.com, 曾想以免费私有仓的差异化来获取用户，但在产品路线上并没有与 GitHub 形成太大差异，因此效果并不理想，而等到微软收购 GitHub 宣布免费创建私有仓后，这点唯一的优势也就没有了。因此 GitLab 后来将重点放到了支持企业级 DevOps 上，全力打造 DevOps 能力，探索出另一条新路，也使得自己的估值指数级上升，获得了市场认可。

如果你有做产品的想法和建议，欢迎与我交流或联系。

### 参考

1. [Tom Preston-Werner: How I Turned Down $300,000 from Microsoft to go Full-Time on GitHub](https://tom.preston-werner.com/2008/10/18/how-i-turned-down-300k.html)
2. [Linus 关于 GitHub PR 的争论](https://github.com/torvalds/linux/pull/17)
3. [How GitHub Democratized Coding, Built a $2 Billion Business, and Found a New Home at Microsoft](https://nira.com/github-history/)
4. [Open Source (Almost) Everything](https://tom.preston-werner.com/2011/11/22/open-source-everything.html)
5. [Almost Everything We Do Will Be Open](https://about.gitlab.com/blog/2015/08/03/almost-everything-we-do-is-now-open/)
6. [GitLab is open core, GitHub is closed source](https://about.gitlab.com/blog/2016/07/20/gitlab-is-open-core-github-is-closed-source/)
7. [GitLab's Open Strategy](https://about.gitlab.com/blog/2016/02/09/gitlab-open-strategy/)
8. [GitLab Culture](https://about.gitlab.com/company/culture/)
9. [History of GitLab](https://about.gitlab.com/company/history/)
10. [Welcome to the DevOps Platform era](https://about.gitlab.com/blog/2021/08/03/welcome-to-the-devops-platform-era/)
11. [GitLab: The World’s Most Transparent Company](https://theorg.com/insights/gitlab-the-worlds-most-transparent-company)
12. [How GitHub Uses GitHub to Build GitHub](https://zachholman.com/talk/how-github-uses-github-to-build-github/)

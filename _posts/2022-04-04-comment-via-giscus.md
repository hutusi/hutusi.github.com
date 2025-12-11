---
layout: post
category: tech
tags: 博客 giscus
title: 给博客换了套新评论系统
subtitle: 用 giscus 替换 gitalk
date: "2022-04-04 14:20:00 +0800"
last_modified_at: "2022-04-04 14:20:00 +0800"
image: articles/2022-jekyll-comments.jpg
---

我的博客引擎用的是 [Jekyll](https://jekyllrb.com/)，一款 “古老” 的静态博客引擎。写下 “古老” 这个词，我不禁感叹时间飞逝，回想当时刚用 Jekyll 时，那时可是新东西。在那个年代，如果不是在 Blogspot、新浪博客这种博客托管平台上写博客而是想自建的话，wordpress 几乎是不二选择。可以说，wordpress 几乎是博客软件的代名词。而 Jekyll 的发明可以说是创造性的，用作者 Tom Preston-Werner（同时也是 GitHub 的创始人）的话说就是用 Jekyll 写博客就“像黑客一样写博客”(*[Blogging Like a Hacker](https://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html)*)。从此，自建博客系统不需要关系服务器，不需要配置数据库，只需要懂 Git、熟悉 Markdown 语法就可以拥有一个完美的程序员的博客。

Jekyll 是用 Ruby 写的静态博客生成引擎，在 github 上开源后，各种语言实现的静态博客生成引擎如雨后春笋般出现。如 NodeJS 实现的 Hexo，Go 实现的 Hugo，还有很多为自己设计的静态博客框架。换静态博客引擎是很多程序员 blogger 的乐趣之一。另外一个乐趣就是换模板，以及换评论系统。

由于静态博客没有后台服务，因此无法实现交互式的评论功能，不过在程序员黑客的世界这不是问题。最方便的是用第三方评论系统服务，做的最好的是 [disqus](https://disqus.com/), 国内有「多说」，不过已下线。只需要在博客中添加一段 JavaScript 代码就可以实现评论功能，评论数据由第三方托管。如 disqus，评论者需要注册 disqus 账号，评论数据也是存在 disqus 上。对于博主而言，就是在 disqus 上根据 [提示](https://disqus.com/admin/create/) 创建一个站点，简单配置一后，然后将 [链接指导的这段代码](https://hutusi.disqus.com/admin/install/platforms/universalcode) 贴到静态博客模板中皆可。而新版 Jekyll 中已经集成了 disqus 服务插件，只需在配置中打开评论功能即可。

但由于众所周知的原因，disqus 早就不能正常访问，因此如果想要用 disqus 作为评论系统则需要考虑到国内有很多人可能无法评论。而 github 的第三方应用扩展机制开放后，利用 github issue 来回复并保存评论。这种开源工具有很多，做的好的有 [gitalk](https://github.com/gitalk/gitalk) 和[utterances](https://github.com/utterance/utterances)，前者是国内网友做的，后者可配置性更强些。

我最早用的是 disqus，后来改成了 gitalk。改成 gitalk 的最好好处是解决了 disqus 一般不能用的问题，而且由于使用 github 账号和 issue 系统，程序员群体会比较喜欢这种体验。不过 gitalk 和 utterances 这种使用 github issue 功能的评论系统，也集成了 issue 的缺点，即不能进行楼中楼式的回复交互。而等到 github discussion 功能推出后，基于 github discussion 开发的评论系统 [giscus](https://github.com/giscus/giscus) 也应运而生了。

本来是不打算再折腾评论系统了，不过清明节放假加上上海疫情一直居家，所以有了空闲时间再折腾下博客，将原先的 gitalk 换成了 giscus。按照 [giscus 官网](https://giscus.app/zh-CN)(做的与 utterances 几乎一致) 的指导一步步操作，并按照提示输入，最后就能得到一段适用自己网站的 JavaScript 代码，然后将这段代码粘贴到博客模板中即可。原 github issue 评论也可以在 github 上转换成 discussion，只是没有 API，需要在页面上单条手工转换，因此我将有评论的 issue 都转成了 discussion。转换 discussion 后，该 issue 会被 lock 并且关闭，而且是无法再打开的。giscus 即 github discussion 的楼中楼功能非常适合做博客评论，加上 emoji 的 reaction 机制简直与 disqus 功能无异了。

另外我将博客做成了双评论系统的方式，默认为 giscus，在评论区点击 disqus 按钮可切换到 disqus 评论方式：giscus 和 disqus 任君选择。虽然这样并不一定能带来更多的评论量，但总是给读者多一种选择。就像我在博文页面左侧添加的 addthis 分享按钮，分享数据并不多，但是只要有，我心里就很高兴。

我将博客的样式模板和博客本身做了分离，样式库在 [hutusi/taletype](https://github.com/hutusi/taletype)，是基于 type 这个 Jekyll 模板上修改的，加了很多我需要的功能，有需要的小伙伴也可以直接取用。

最后，说一下我对博客评论的看法。我觉得评论对于博客来说就像是炒菜所放的盐，缺少了评论的博客固然还是那盘菜，但却失了味道，吃没有味道的菜是坚持不久的。因此，我非常期待博客读者的评论，每一条评论都是对我最大的鼓励。如果碰巧你也在写博客，欢迎与我[互换友链](/links/)。

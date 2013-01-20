---
layout: post
category: blog
tags: [jekyll]
title: (翻译)像黑客一样写博客
---

{{ page.title }}
================

<p class="meta">29 Mar 2012 Shanghai </p>

[原文](http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html) by Tom Preston Werner

回到2000年，那时我想当一名职业的写手，和一些怀有抱负的诗人和作家一样，我每天要花上好几个小时在[LiveJournal][1] 上写作。从那时起我分别在三个不同的域名上写一些技术文章，包括web标准、印刷设计、摄影、Flash、插图、信息架构、ColdFusion、包管理、PHP、CSS、广告、Ruby、Rails以及Erlang。

我热爱写作，并乐于和他人分享自己的思考。将思想转化为文字的这种转换艺术是将思考固化并提炼的最有效方法。尽管非常热衷写博客，我却似乎陷入了一个中途放弃又开始再放弃的怪圈。每当开始新一轮时，我都下决心做一些反思来确认是哪些因素造成了这个怪圈模式。

有很多“我不想要”的原因：我厌倦了类似[Wordpress][2]和[Mephisto][3]的博客引擎，想要写一些非常棒的博文而不是在千万个模板页面的设计或是调整评论上耗费一整天，而且总是落后于最新版本。有些博客托管网站像[Posterous][4]虽然很吸引人，但我更想要自己设计设计并且托管在我选择的域名上。基于同样的原因，其他一些网站例如[wordpress.com][5]、[blogger.com][6]也被排除在外了。有少些人直接将[GitHub][7]当blog使用（这是件很酷的事），但又有点不合我胃口。

10月19日，星期天，我坐在旧金山家中，喝着苹果汁。在一段时间的沉思之后，突然有了主意。我不是一名散文作家，我是一名代码作家（程序员）。如果尝试着从软件开发的角度去写博客，那会是什么情况？

首先，所有写的东西都应该存放在[Git][8]的仓库中。这确保我可以尝试不同的想法，使用我喜爱的编辑器和命令行去写博文；并且可以通过简单的部署脚本或commit钩子发布一篇博文。要将复杂度控制在一定范围内，相对于动态网站，静态网站更易于维护。我的博客要能够轻松定制，而背景图片设计则意味着要一直对外观和布局做调整。

过去的一个月里，我将这些概念赋诸项目实践，称之为[Jekyll][9]。Jekyll是一个简单的博客软件，已给静态网站生成器。它使用一个模板目录，经过[Textile][10]和[Liquid][11]转换，输出一个完全静态的网站，适合[Apache][12]或其他网站服务器。如果你是在我的网站(http://tom.preston-werner.com)上读的这篇文章，你所读到的就是Jekyll生成的博客。

要了解它是如何工作的，请在新窗口打开我的[TPW](https://github.com/mojombo/tpw)库，我在那里引用代码进行解释。

看一下[index.html](https://github.com/mojombo/tpw/blob/master/index.html)，这个文件是网站的首页。在文件的顶端有YAML格式的元数据，这些数据告诉Jekyll如何布局、页面的标题，等等。在这个例子中，我指定使用"default"布局模板。你可以在[\_layouts](https://github.com/mojombo/tpw/tree/master/_layouts)目录找到这些布局文件，打开[default.html](https://github.com/mojombo/tpw/blob/master/_layouts/default.html)主页是按照这个布局格式显示的。

你同样会发现在这些文件里使用了Liquid模板代码，[Liquid](http://liquidmarkup.org/)是一种简单的、可扩展的模板语言，它可以很轻松的在你的模板文件中嵌入代码。例如在主页上我希望显示所有博客的列表。Jekyll提供了一个关于站点信息的Hash变量，<code>site.posts</code>包含了一个所有博文的反序列表，而每个博文，也包含了一些变量如<code>titile</code>和<code>date</code>.

Jekyll解析[\_posts](https://github.com/mojombo/tpw/tree/master/_posts)目录，得到所有的博文列表。每一篇博文的文件名包含发布日期，打开本文的源文件：[2008-11-17-blogging-like-a-hacker.textile](https://github.com/mojombo/tpw/blob/master/_posts/2008-11-17-blogging-like-a-hacker.textile)。由于GitHub会对textile文件自动渲染，为了更好的理解该文件，可以通过[raw](https://raw.github.com/mojombo/tpw/master/_posts/2008-11-17-blogging-like-a-hacker.textile)视图查看原始文件。这里我指定了<code>post</code>作为布局模板，布局模板可以嵌套其他的布局模板，以便于更灵活的调整页面布局。在我的例子中使用了嵌套模板为每条博客显示相关的博文。

Jekyll使用一些特殊的方法来处理这些博文，包含日期的文件名用来组成URL，例如本文的URL就是<code>http://tom.preston-werner.com/2008/11/17/blogging-like-a-hacker.html</code>。

以下划线开头的文件夹外的那些文件...，如果一个文件没有以YAML开头，那么将不会通过Liquid解译。

将网站投入运转，只需要运行命令：
<pre class="terminal"><code>$ jekyll /path/to/raw/site /path/to/place/generated/site</code></pre>

Jekyll项目还很年轻，我只开发了亟需使用的一些功能。我希望项目会成熟起来并支持一些附加的功能。如果你准备用Jekyll做你的博客系统，告诉我你希望在下个版本中增加什么功能。更好的办法是，Fork Jekyll这个项目，自己定制你的博客吧。

我已经使用Jekyll一个多月了，我很喜欢它。基于需求来开发Jekyll本身就是个回报。我可以在Textmate上编辑博客，它能给我提供自动的拼写检查；我可以直接操作CSS和页面模板。所有东西都保存在GitHub上。现在当我在写博客时感觉很轻松。这个系统很简单，以至于我可以在头脑中完成整个转换过程，思想和博文的距离更近了。我觉得这会让我写得更好。

[1]: http://www.livejournal.com/
[2]: http://wordpress.org/
[3]: http://www.mephisto.com/ 
[4]: https://posterous.com/
[5]: http://wordpress.com/
[6]: http://www.blogger.com/
[7]: https://github.com/
[8]: http://git-scm.com/
[9]: https://github.com/mojombo/jekyll
[10]: http://textile.sitemonks.com/
[11]: http://liquidmarkup.org/
[12]: http://www.apache.org/
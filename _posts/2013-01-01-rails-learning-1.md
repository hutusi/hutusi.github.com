---
layout: post
category: tech
tags: [rails]
title: Rails学习笔记(1)
---

学习参考书为《Agile Web Development with Rails》(4th edition)，rails之父dhh跟其他人合写的。第一部分介绍了rails的基本知识，第二部分通过创建一个购物系统来学习rails，第三部分更深入的学习rails。

rails是一个MVC架构的web development framework. 传统的MVC框架及流程如图所示：浏览器发送请求给web服务，controller处理请求并与Model交互，然后调用view生成新的页面传到给浏览器。

<a href="http://www.flickr.com/photos/hutusi/8420338108/" title="mvc by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm9.staticflickr.com/8513/8420338108_e1fdfe7af6.jpg" width="500" height="232" alt="mvc"></a>

rails框架：

<a href="http://www.flickr.com/photos/hutusi/8419238811/" title="rails_mvc by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm9.staticflickr.com/8221/8419238811_7ee9b1c5d3.jpg" width="500" height="246" alt="rails_mvc"></a>


+	模型(Model): 模型包含着应用的状态，状态可能是临时的也可能长久存于数据库中。需要注意的是模型不仅仅是数据，而且包含了代表数据的逻辑。
	
	模型在rails中的体现是ActionRecord，它实现了rails的ORM(Object-Relational Map): 将关系型数据库表和对象类关联起来。表对应类，表中的行数据对应类的对象，表列对应类的属性。如果数据库中有个表叫orders，那么对应的类就是Order，无需设置，这就是rails的Coc（见本文后面）。

+	视图(View): 视图负责根据模型中的数据生成用户界面。在web应用中view通常生成整个或部分页面，表现为内嵌ruby的HTML/XML/javascript模板。rails中为ruby模板(Embedded Ruby, Erb)。
	
	视图在rails中的体现是ActionPack的ActionView.

+	控制器(Controller): 控制器将用户界面和数据模型关联起来，并充当协调运作的角色。它接收各类用户操作，更新数据模型，并将结果展示给用户。

	控制器在rails中的体现是ActionPack的ActionController.

rails的两个基本原则是DRY(Don't Reoeat Yourself, 不重复)和CoC(Convention over Configuration, 约定优于配置)。第一点可以说是写好任何一份代码的第一准则，rails更是做到了极致。而第二点则更体现了rails高明的地方。无需配置哪些符号属于model哪些属于view，只需按照rails的命名规范来写，rails便能识别出来；诸如此类。这让我联想到了一个反面典型。当时我在配置公司的持续集成框架时，新增了一种插件是非常痛苦的事，因为一个变量要在多个xml文件中配置方能生效，让人生厌！

rails的CoC让我想起了xp的原则，如果可以为之增加一条，那应该这样写：如果命名是重要的，那就让命名代替配置。

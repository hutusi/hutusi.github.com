---
layout: post
category: tech
tags: [rails]
title: Rails学习笔记(4)
---

# Task H: Sending Mail

给Depot系统增加发送邮件功能。


## 配置email

在config/environments目录的配置文件里（development, test, production）中的Depot::Application.configure代码块中配置发送邮件的模式，有三种：

	config.action_mailer.delivery_method = :smtp | :sendmail | :test
	
:test配置用在测试中，实际不能发送邮件。

:sendmail配置实际上是讲发送邮件方法委托给了系统的sendmail程序。（unix-like系统）

默认的:smtp配置需要一些额外的SMTP server的配置信息，例如：

	Depot::Application.configure do


## 发送邮件

利用rails的脚本generator创建mailer，mailer是存在app/mailers目录下的类，包含一个或多个方法，每一个方法对应一种邮件模板。

如果创建一个在收到订单和发货的时候会发邮件通知的mailer：

	depot> rails generate mailer OrderNotifier received shipped
	
生成的OrderNotifier类如下：

	class OrderNotifier < ActionMailer::Base
	
	  def received
	end
mail方法接受一些参数包括： :to, :cc, :from, :subject … 
## email templates

mailer generator脚本在app/views/order_notifier中相应创建了两个邮件模板(.erb文件)，为发送邮件的正文。

## 生成邮件

在orders_controller里的create方法里增加

	OrderNotifier.received(@order).deliver

## 如何接收邮件？

利用Mailer的receive方法…

## 集成测试

创建一个集成测试用例：

	depot> rails generate integration_test user_stories


# Task I: Logging in

增加用户管理功能，需要登录后才能使用管理员功能。

## 增加用户Model

	depot> rails generate scaffold User name:string password_digest:string
	
	depot> rake db:migrate
	
修改User Model：

	class User < ActiveRecord::Base


然后：

	depot> bundle install
	
## 验证用户

需要验证用户输入的用户名和密码；一旦验证通过，在本次会话（直到logout）中生效；且只允许logged in的管理员才能使用管理员功能。








多语言支持。

## 选择locale

新建文件 config/initializer/i18n.rb: 

	#encoding: utf-8

在routes中增加一层表示语言的路径：

	Depot::Application.routes.draw do
	…
	  scope '(:locale)' do





`set_i18n_locale_from_params` 方法主要是通过params设置locale：如果params存在该语言则设置，如果不存在则使用当前的语言。

`default_url_options` 方法…


## 翻译

通过将文本替换为`I18n.translate`方法来翻译文本，可以简写为`t`，如在 views/layouts/application.html.erb 文件中：

	<%= @page_title || t('.title') %>

在 config/locales 中增加翻译配置文件：

在英文配置 config/locales/en.yml:

	en:
	  layouts:
	    application:
	      title:   "Pragmatic Bookshelf"
	      home:    "Home"	
	      
在西班牙文 config/locales/es.yml:

	es:
	  layouts:
	    application:
	      title:   "Publicaciones de Pragmatic"
	      home:    "Inicio"










Rails是一个单线程的web服务，所以需要HTTP代理服务Passenger来处理并发的客户端响应。

## MySQL

创建production表结构，配置…

migrate:

	depot> rake db:setup RAILS_ENV="production"
	
## Capistrano

## Checking up application

有两个方法：

### 查看log 

	$ cd /home/rubys/work/depot/current

### rails console 

	$ cd /home/rubys/work/depot/





### configuration:

### testing:

### deployment:



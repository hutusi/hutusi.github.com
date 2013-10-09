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

	Depot::Application.configure do	  config.action_mailer.delivery_method = :smtp	  	  config.action_mailer.smtp_settings = {	    address: "smtp.gmail.com",	    port: 587,	    domain: "domain.of.sender.net",	    authentication: "plain",	    user_name: "dave",	    password: "secret",	    enable_starttls_auto: true	  }	end


## 发送邮件

利用rails的脚本generator创建mailer，mailer是存在app/mailers目录下的类，包含一个或多个方法，每一个方法对应一种邮件模板。

如果创建一个在收到订单和发货的时候会发邮件通知的mailer：

	depot> rails generate mailer OrderNotifier received shipped
	
生成的OrderNotifier类如下：

	class OrderNotifier < ActionMailer::Base	  default from: 'Sam Ruby <depot@example.com>'
	
	  def received	    @greeting = "Hi"	    mail to: order.email, subject: 'Pragmatic Store Order Confirmation'	  end	  …… 
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

	class User < ActiveRecord::Base	  validates :name, presence: true, uniqueness: true	  has_secure_password	end
注意 `has_secure_password` 这个方法，此方法需要引入bcrypt-ruby这个gem。在Gemfile中增加：
	# To use ActiveModel has_secure_password	gem 'bcrypt-ruby', '~> 3.0.0'	
然后：

	depot> bundle install
	
## 验证用户

需要验证用户输入的用户名和密码；一旦验证通过，在本次会话（直到logout）中生效；且只允许logged in的管理员才能使用管理员功能。我们需要创建session controller来支持logging in和logging out，并且需要admin controller来欢迎管理员登录：
	depot> rails generate controller Sessions new create destroy		depot> rails generate controller Admin indexlogging in的参数流：
<a href="http://www.flickr.com/photos/hutusi/10169874206/" title="Screen Shot 2013-09-28 at 4.13.25 PM.png by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm4.staticflickr.com/3823/10169874206_06ed815e6f.jpg" width="500" height="392" alt="Screen Shot 2013-09-28 at 4.13.25 PM.png"></a>## 限制访问
为了阻止非登录管理员的用户访问管理等页面，我们使用rails的filter功能。
在Controller中增加：	class ApplicationController < ActionController::Base	  before_filter :authorize	  # ...	  protected	  	  def authorize	    unless User.find_by_id(session[:user_id])	      redirect_to login_url, notice: "Please log in"	    end	  end	endbefore_filter会在每次对application的操作前调用 authorize 方法。
对于一些不需要验证就可以操作的controller，如store、session，可以使用 `skip_before_filter` :
	class StoreController < ApplicationController	  skip_before_filter :authorize对于controller的某些操作不作限制，如cart的一些：
	class CartsController < ApplicationController	  skip_before_filter :authorize, only: [:create, :update, :destroy]# Task J: Internationalization

多语言支持。

## 选择locale

新建文件 config/initializer/i18n.rb: 

	#encoding: utf-8	I18n.default_locale = :en	LANGUAGES = [	  ['English', 'en'],	  ["Espa&ntilde;ol".html_safe, 'es']	]

在routes中增加一层表示语言的路径：

	Depot::Application.routes.draw do
	…
	  scope '(:locale)' do	    resources :users	    resources :orders	    …
	  end	end
	这样，就将资源地址嵌套在语言层下了。http://localhost:3000/ 会指向默认语言，也就是 http://localhost:3000/en； http://localhost:3000/es会指向西班牙语页面。
	我们还需要创建一个 before_filter校验和 default_url_options方法：
	class ApplicationController < ActionController::Base	  before_filter :set_i18n_locale_from_params	  # ...	  protected	    def set_i18n_locale_from_params	      if params[:locale]	        if I18n.available_locales.include?(params[:locale].to_sym)	          I18n.locale = params[:locale]	        else	          flash.now[:notice] = "#{params[:locale]} translation not available"	          logger.error flash.now[:notice]	        end	      end	    end	    	    def default_url_options	      { locale: I18n.locale }	    end	end

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
## locale switcher
…
# Task K: Deployment and Production
发布。从开发到发布的变化示意图：

<a href="http://www.flickr.com/photos/hutusi/10169694404/" title="Screen Shot 2013-10-01 at 11.28.34 PM.png by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm8.staticflickr.com/7307/10169694404_e8c4a54992.jpg" width="500" height="231" alt="Screen Shot 2013-10-01 at 11.28.34 PM.png"></a>
Apache httpd + Phusion Passenger + MySQL
## Passenger
install:
	$ gem install passenger	$ passenger-install-apache2-module 
Rails是一个单线程的web服务，所以需要HTTP代理服务Passenger来处理并发的客户端响应。

## MySQL

创建production表结构，配置…

migrate:

	depot> rake db:setup RAILS_ENV="production"
	
## Capistrano

## Checking up application

有两个方法：

### 查看log 

	$ cd /home/rubys/work/depot/current	$ tail -f log/production.log

### rails console 

	$ cd /home/rubys/work/depot/	$ rails console production	# Depot Retrospective
## rails concepts
### Model:

Model中管理的是永久性数据，如在Depot系统中创建了5个Model： Cart, LineItem, Order, Product, User. 

所有Model都有id, created_at, updated_at属性，另外可以自定义string, int等类型的属性，以及一些foreign key属性，如product_id。 还可以创建无需存在数据库中的虚拟属性，如password.

利用has_many, belongs_to等方法来关联模型与模型。### View:

View是对外展现的组件。Rails scaffold提供了edit, index, new, show 方法。### Controller:
从Model中获取或保存数据，对View进行操作或展示。

### configuration:

数据库，routes，语言等配置。

### testing:

### deployment:
## documenting	depot> rake doc:app	depot> rake stats
	

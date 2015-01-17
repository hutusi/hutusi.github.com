---
layout: post
category: tech
tags: [rails]
title: Rails学习笔记(2)
---

# Depot系统

《Agile web development with rails》第二部分花了很大的篇幅，通过一个购物网站系统例子来介绍如何使用rails开发一个网站。网站例子是一个网上书店系统（Depot系统）。

既然是敏捷开发，首先能想到的就是迭代增量开发。而开发之前所要作的便是分析需求，下面三个概念可以帮助理解系统：

## Use case
  
use case是如何使用系统的简单描述，首先要识别系统的用户角色。（对于depot系统的用户就是买家和卖家），然后根据他们的行为场景列举use cases.

## Page flow

将用户使用场景贯穿起来，在纸上画出web的page flow:

买家的page flow：

<a href="http://www.flickr.com/photos/hutusi/8713563961/" title="Figure_06_Flow_of_buyer_pages by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm9.staticflickr.com/8276/8713563961_738446f533.jpg" width="500" height="418" alt="Figure_06_Flow_of_buyer_pages"></a>

卖家的page flow:

<a href="http://www.flickr.com/photos/hutusi/8713563967/" title="Figure_07_Flow_of_seller_pages by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm9.staticflickr.com/8408/8713563967_b3b9054777.jpg" width="500" height="340" alt="Figure_07_Flow_of_seller_pages"></a>

## Data

接下来可以简单的对系统进行数据建模，Product, Cart, Order, Line Item...

<a href="http://www.flickr.com/photos/hutusi/8713563949/" title="Figure_08_Initial_guess_at_application_data by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm9.staticflickr.com/8535/8713563949_db7e8bd5a4.jpg" width="500" height="304" alt="Figure_08_Initial_guess_at_application_data"></a>

后面的章节就根据对需求的理解划分task进行编码了。

# Task A: Creating the Application

本章节介绍如何创建rails工程以及如何利用scaffold一键式创建Model、controller、view等套件，以及如何使用migration来创建数据库。

## creating a rails application

只需要在命令行上输入：
	
	rails new depot
	
便会自动创建一个名为depot的rails工程。

## generating the scaffold


	rails generate scaffold Product \
 	  title:string description:text image_url:string price:decimal

利用scaffold一键式创建Model、Controller、View、DataTable以及Tests：

Model: Product类， 包含title, description, image_url和price四个attributes.

Controller: ProductController类，默认包含 index, show, new, edit, create, destroy 六个方法。

View: products/index, products/show, products/new, products/edit 对应controller的前四个方法。

DataTable: products表，列名为title, description, image_url, price, 对应Model

Tests： unit test， functional test


## applying the migration

`scaffold generate` 只是帮助生成了创建数据库表的ruby脚本，并未在数据中实际创建表。需要执行migrate操作才可以使之生效。表创建的脚本在 db/migrate/ 目录中，查看或修改脚本，然后执行： 

	rake db:migrate


## db:seed

在db/seeds.rb中定义...

## Erb

embedded ruby file

## Scss

Sassy CSS

## rails helper method

cycle(): cycle('list_line_odd', 'list_line_even'), 

strip_tags(): remove the HTML tags

truncate(): truncate string by designate number

link_to():   
    
    link_to 'Destroy', product,            confirm: 'Are you sure?',            method: :delete

如果点击该link，rails会弹出dialog提示确认而后delete该product； `method: :delete` 表示调用Controller的delete方法，且将会使用HTTP的delete方法。

HTTP的四种方法： GET, POST, PUT, DELETE


# Task B: Validation and Unit testing

本task实现界面输入的校验功能。

## Validating 

在Model中添加语句： `validaes :title, :description, :image_url, presence: true`  表示校验:title, :description, :image_url 这三个attributes必须存在（值不能为空）。

`validates :price, numericality: {greater_than_or_equal_to: 0.01}` numericality() 来校验price是个合法的数字，且大于或等于0.01。

还有例子：

	validates :image_url, allow_blank: true, format: {	  with: %r{\.(gif|jpg|png)$}i,	  message: 'must be a URL for GIF, JPG or PNG image.'	}	
## Unit testing of Models

test fixtures: rails中的fixture是指一组为测试准备的Model数据。

unit test的sut(system under test)是Model


## Test fixtures 

在软件测试的定义中，Fixture是为运行测试准备的环境。在Rails的测试框架中，Fixture是一组为被测试的Model准备的数据内容，以csv或yaml格式表示。

如在Fixture products.yml 中定义了一个名为ruby的产品:

	ruby: 
	  title:       Programming Ruby 1.9
	  description: 
	    Ruby is the fastest growing and most exciting dynamic
	    language out there.  If you need to get working programs
	    delivered fast, you should add Ruby to your toolbox.
	  price:       49.50
	  image_url:   ruby.png  

在测试用例中便可以 `products(:ruby)` 来使用该Fixture数据，或其中的属性，如 `products(:ruby).title` 


# Task C: Catalog display

## generate controller

如下命令，执行

	rails generate controller Store index

将创建一个StoreController类，含有一个index方法，对应store/index视图(view). 在浏览器地址栏输入 `http://localhost:3000/store/index` 便可访问此视图。如果要将此设置为网站的默认根URL，需要删除`public/index.html`，并修改 `config/routes.rb`中内容:

	root to: 'store#index', as: 'store' 

## tips： 

使用 `sanitize()` 函数来修饰文本，可以在文本中增加HTML风格元素。注意：使用会有安全隐患。

使用 `image_tag()` 能帮助自动添加HTML的<img>标签。

`number_to_currency()` 将数字转为金额显示。

## functional tests

functional test的sut是controller




---
layout: post
category: tech
tags: [rails]
title: Rails学习笔记(3)
---

# Task D: Cart Creation

给Depot系统增加购物车功能。


## connect model to model

利用has_many, belongs_to 等修饰model

	class Cart < ActiveRecord::Base
	  has_many :line_items, dependent: :destroy
	end

Cart与LineItem的关系是一对多，即一个Cart中可以有多个line_items实例。而dependent: :destroy则表示line_item的存在依赖于cart, 如果删除cart，则自动将cart中的所有line_items也在数据库中删除。


	class LineItem < ActiveRecord::Base
	  belongs_to :product
	  belongs_to :cart
	end

LineItem属于Product，也属于Cart 


	class Product < ActiveRecord::Base
	  has_many :line_items
	  before_destroy :ensure_not_referenced_by_any_line_item
	
	  private
	
	    def ensure_not_referenced_by_any_line_item
	      ...
	    end
	end

before_destroy来指定在destroy product数据前调用自定义方法，如ensure_not_referenced_by_any_line_item.

## adding a button

使用 `button_to()`添加一个button， 注意：`link_to()` 调用的是HTTP GET, 而`button_to()`调用的是 HTTP POST. 

# Task E: A Smarter Cart

购物车增加如重复商品购买处理及错误提示等功能。 


## migrate 改变已有数据库结构

如像line_items表中增加quantity（类型为integer）列：

	rails generate migration add_quantity_to_line_items quantity:integer
	
命令语句模式为： `add_XXX_to_TABLE` 或 `remove_XXX_from_TABLE`

这样rails会帮助生成change()方法，告诉数据库作结构调整。

然后执行 `rake db:migrate` 

也可以使用下面语句创建migration：

	rails generate migration combine_items_in_cart
	
这时候rails不能推断我们想干什么，因此自动生成的change() 方法对我们没什么用处。于是一般会写成 up() 和down() 方法，分别对应 db:migrate 和 db:rollback

## Dynamic Finders

例如， `current_item = line_items.find_by_product_id(product_id) `

find_by_product_id() 无需定义该函数，Active Record 会识别该未定义的函数并根据"find_by"前缀来找符合"product_id"列值的line_item 


## Handling Errors

	begin	  @cart = Cart.find(params[:id])	rescue ActiveRecord::RecordNotFound	  logger.error "Attempt to access invalid cart #{params[:id]}"	  redirect_to store_url, notice: 'Invalid cart'
	…

logger用来记录日志，每个controller都有一个logger属性。

redirect_to()来转向页面。

# Task F: Add a dash of Ajax

给购物系统添加Ajax功能，让它变得生动起来。 Ajax原意为： Asynchronous Javascript and XML. 

## Partial templates

之前的Cart页面是通过CartController的Show方法及对应的.html.erb模板render的，现在希望将它移到主页的sidebar里。因此不需要单独的页面，而是利用partial templates来render.

partial templates 可以认为是rails里view的函数方法，可以在其他模板或controller中使用render来调用partial templates。

将cart的view代码移到_cart.html.erb中，然后在show.html.erb和application.html.erb中直接调用 `render @cart`. 

## ajax 和 json

在`add to cart`时刷新sidebar的cart信息而不需要刷新整个页面，我们需要发送ajax request给server，在button_to()增加 `remote: true`即可：

	<%= button_to 'Add to Cart', line_items_path(product_id: product),	   remote: true %>	   
接下来要让application回应该请求。如果request是javascript的话，让create操作不再重定向到index。在controller的create方法中，respond_to语句块中增加 `format.js` 即可。于是该create方法将会处理ajax request, 并且寻找create模板来render.

如在view中增加`create.js.erb`模板文件：

	$('#cart').html("<%=j render @cart %>");

这样，一个ajax的application就创建好了。添加item时并不会刷新整个页面而是刷新sidebar中cart的内容。


## highlight 

接来下要添加一些动画的效果。在 `app/assets/javascripts/application.js`添加 jQuery UI 库： 

	//= require jquery-ui
	
在LineItemsController.create 的respond处理中指定当前新增的item：

	format.js { @current_item = @line_item }
	
然后在 create.js.erb 中对当前新增的item添加动画效果：

	$('#current_item').css({'background-color':'#88ff88'}).	  animate({'background-color':'#114411'}, 1000);

## helper methods

在helpers目录里添加helper函数，实例：

在views/layouts/application.html.erb 中：

	<%= hidden_div_if(@cart.line_items.empty?, id: 'cart') do %>	<%= render @cart %>	<% end %>

在helpers/application_helper.rb 中：

	module ApplicationHelper	  def hidden_div_if(condition, attributes = {}, &block)	    if condition	      attributes["style"] = "display: none"	    end	    content_tag("div", attributes, &block)	  end	end

自定义的hidden_div_if函数又调用了rails得标准helper函数content_tag. 

## CoffeeScript

Accelerated JavaScript Development.

## testing ajax

……


# Task G: Check out

这一章中，将完成Checkout功能。

首先，增加order:

	depot> rails generate scaffold order name:string address:text \	  email:string pay_type:string

	depot> rails generate migration add_order_id_to_line_item \	  order_id:integer	 
	 depot> rake db:migrate

然后要在view创建order的表单。views/carts/_cart.html.erb…

order的model、controller、view对应关系如图：

<a href="http://www.flickr.com/photos/hutusi/9803570913/" title="Screen Shot 2013-09-19 at 12.54.16 AM by Where ignorance is bliss, it's folly to be wise, on Flickr"><img src="http://farm6.staticflickr.com/5530/9803570913_b1386c8487.jpg" width="500" height="252" alt="Screen Shot 2013-09-19 at 12.54.16 AM"></a>	  

## atom feeds

rails支持rss 1.0, rss 2.0 和atom标准。要是网站支持atom订阅很简单，在controller中增加action：

	def who_bought	  @product = Product.find(params[:id])	  respond_to do |format|	    format.atom	  end	end

并写一个atom模板即可：如 `who_bought.atom.builder.`

## Gemfile

为了增加分页功能，我们不需要写一份分页代码，而是找现成的gem库即可。在Gemfile中增加 `gem 'will_paginate', '~> 3.0'`

然后运行：

	depot> bundle install
	
即可将gem从网上下载并安装。

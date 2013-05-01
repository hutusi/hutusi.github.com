---
layout: post
category: tech
tags: [rails]
title: Rails学习笔记(2)
---


scaffold
========

rails generate scaffold Product \
 title:string description:text image_url:string price:decimal

利用scaffold一键式创建Model、Controller、View、DataTable以及Tests：

Model: Product类， 包含title, description, image_url和price四个attributes.

Controller: ProductController类，默认包含 index, show, new, edit, create, destroy 六个方法。

View: products/index, products/show, products/new, products/edit 对应controller的前四个方法。

DataTable: products表，列名为title, description, image_url, price, 对应Model

Tests： unit test， functional test


db:migrate
==========

`scaffold generate` 只是帮助生成了创建数据库表的ruby脚本，并未在数据中实际创建表。需要执行migrate操作才可以使之生效。表创建的脚本在 db/migrate/ 目录中，查看或修改脚本，然后执行： 

rake db:migrate


db:seed
=======

在db/seeds.rb中定义...


validates
=========

在Model中添加语句： validaes :title, :description, :image_url, presence: true  表示校验:title, :description, :image_url 这三个attributes必须存在（值不能为空）。


generate controller
===================

rails generate controller Store index

将创建一个StoreController类，含有一个index方法，对应store/index视图(view).


unit tests
==========

test fixtures: rails中的fixture是指一组为测试准备的Model数据。

unit test的sut(system under test)是Model


functional tests
================

functional test的sut是controller


connect model to model
======================

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







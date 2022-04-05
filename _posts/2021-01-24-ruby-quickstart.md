---
layout: post
category: tech
tags: Ruby 编程
title: Ruby 编程语言入门
date: "2021-01-24 23:59:00 +0800"
gh_issue: 95
---

> Ruby is designed to make programmers happy.
> -- Matz (松本行弘)

松本行弘于1993年开始编写 Ruby 编程语言，并于 1995年发布。2006年 DHH 发布 Ruby on Rails 框架，Ruby 开始流行，并于 2006年被 TIOBE 选为年度编程语言。最近这些年因为云计算和移动互联网的兴起，Ruby 与同类语言相比显得不那么火。不过我倒是一直听喜爱 Ruby, 最近的项目又要用到 Ruby, 便整理下 Ruby 的一些知识教程。以下关于 Ruby 的语法介绍和示例主要来自《The Ruby Programming Languange》这本书[^1]。（这本书是松本行弘本人所写，学习 Ruby 语言必看。）

## 语法

Ruby 是一款解释型、强类型、动态类型的面向对象编程语言。Ruby 语法优雅，目标是做到尽可能贴近英文语法。

### 1. Hello world

到 Ruby 的官网[^2]上下载 Ruby 程序，推荐使用 Unix-like 操作系统，如 MacOS、Linux，而一般不建议用 Windows。推荐使用 rbenv 或 RVM 来安装，详细可参见网站指导。安装好 Ruby 后可执行 `ruby` 来执行 ruby 语言脚本，也可以输入 `irb` 打开 Ruby 交互式命令行工具(interactive ruby)开始使用。在 `irb` 上输入：

```ruby
p 'hello, world!'
```

`p` 是 Ruby 的标准输出函数 `puts` 的简写。这里便可以看到 `irb` 返回 'hello, world!' 输出。

如果要打印5次 'hello, world!', 那只需要写：

```ruby
5.times { p 'hello, world!' }
```

是不是很有意思。

### 2. 类型

Ruby 中所有值都是对象（包括 nil 值），可以通过调用 `class` 方法来获知其类。Ruby 不像其他语言一样区分基本类型(primitive types) 和对象类型(object types)，对于 Ruby 而言，所有类型都继承自 Object 类(根类为 BasicObject).

试着在 irb 上输入：

```ruby
1.class
Integer.superclass
```

#### 数字(Numeric)

Ruby 中包含五种 built-in 数字类型类: Numeric, Integer, Float, Fixnum 和 Bignum, 另外标准库中还提供了三种数字类型：Complex, BigDecimal, Rational. 除 Numeric 类外其他数字类型类都继承自 Numeric, 关系如下：

```shell
                                +-----------+
                                |           |
                                |  Numeric  |
                                |           |
         +-----------+----------++----------+--+--------------+
         |           |           |             |              |
         |           |           |             |              |
    +----+----+  +---+---+  +----+----+  +-----+------+  +----+-----+
    |         |  |       |  |         |  |            |  |          |
    | Integer |  | Float |  | Complex |  | BigDecimal |  | Rational |
    |         |  |       |  |         |  |            |  |          |
    +--+------+  +-------+  +---------+  +------------+  +----------+
       |      |
       |      |
+------+-+  +-+------+
|        |  |        |
| Fixnum |  | Bignum |
|        |  |        |
+--------+  +--------+
```

31 位以内的整数为 Fixnum, 超过位数为 Bignum, Bignum 没有位数限制。

对于大数 Ruby 提供了分段表示或科学计数法方便阅读，如：

```ruby
1_000_000_000     # 十亿, 1 billion
1_000_000_000.01  # 十亿又零点一
6.02e23           # 6.02 * 10^23
```

* 运算符

Ruby 支持基本的数学运算符(+, -, *, /)，及取余(%), 求指数(**)，等。

所有数字对象均为不可变值，因此 Ruby 中也没有自增和自减操作符(++, --)。

```ruby
x = 5/2     # 结果为 2
y = 5.0/2   # 结果为 2.5
x**4        # x*x*x*x
x**-1       # 1/x
x**(1/3.0)  # 求 x 的立方根
x**(1/3)    # 由于 1/3 为零，该表达式即为 x**0 = 1
```

* 浮点数精度问题

```ruby
0.4 - 0.3 == 0.1
```

与 C 等语言的浮点数运算结果一样，上述表达式运算的结果为 `false`, 不过 Ruby 提供了一种解决方案，即标准库中提供的 BigDecimal 类，使用该类可以按实际值运算，但效率比浮点数慢。

```ruby
require 'bigdecimal'
BigDecimal('0.4') - BigDecimal('0.3') == BigDecimal('0.1')
```

#### 文本(String)

Ruby 有多种文本的表达方式：

##### 1. 简单文本以单引号('')包含, 除 `'` 和 `\` 字符外都不会转义。

```ruby
'this\'s a simple string.'
```

##### 2. 普通文本以双引号("")包含，可转义字符，且可以包含变量或表达式(内嵌 `#{ expr }`)。

```ruby
"360 degrees = #{2*Math::PI} radians"
```

也可以用类似 C 语言的 sprintf 格式化输出表示：

```ruby
"pi is about %.4f" % Math::PI
"%s: %f" % ["pi", Math::PI]
```

##### 3. 自定义分隔符表示

以 `%q` 或 `%Q` 开头，紧接着以及一个符号开始，如 `|/\!;:` 等，而如果分隔符是以 `{[(<` 开始的，那么字符串认定则到以匹配到 `}])>` 为止。`%q` 对应单引号 `'` 文本， `%Q` 对应双引号 `"` 文本，其中 `%Q` 可省略 `Q`, 简写为 `%`. 例：

```ruby 
%q|don't worry about escaping ' character|
%Q-end with newline \n-
%<<book>ruby<book/>>
```

##### 4. HERE 文档

对于大段文本，Ruby 提供了一种表示方法：以 `<<` 或 `<<-` 开头，紧接一个任意标志字符串（如下面例子中的 `HERE`），那么从此行后到第一个遇到该字符串匹配行之前的文本都是表示文本内容。

```ruby
document = <<HERE
  this a string literal.
  It has two lines and abruptly ends...
HERE
```

* 在 Ruby 中，文本（字符串）值默认是可变值，这与其他语言是不同的。

#### 数组(Array)

##### 1. 定义

有两种定义数组的方式：

```ruby
a = []
a = [1,2,3]
```
或

```ruby
a = Array.new
```

对于字符串数组，有还可以这样定义：

```ruby
words = %w[this is a test]    # words = ['this', 'is', 'a', 'test']
```

##### 2. 数组类型是动态的，一个数组中可包含任意类型的数据

```ruby
a = [1, 2, 3]
a[0] = 'zero' # ['zero', 2, 3]
```

向数组中追加数据使用 `push` 方法，或者更简单的 `<<`:

```ruby
a = []
a << 1        # 1
a << 2 << 3   # [1, 2, 3]
a << [4, 5]   # [1, 2, 3, [4, 5]] 嵌套数组
```

##### 3. 数组下标

```ruby
a = [1, 2, 3, 4, 5]
a[0]          # 1
a[-2]         # 4, 负数下标从最后一个倒数

# 获取子数组
a[1, 2]       # [2, 3] 第一个下标数字表示起始下标，第二个表示子数组长度
a[1, 0]       # [] 
a[0...-1]     # [1, 2, 3, 4]
```

#### 范围(Range)

Range 表示一个区间，以 `..` 或 `...` 来表示，区别是后者不包含结束值。

```ruby
1..10       # 从 1 到 10 的所有整数，包括 10
1.0...10.0  # 从 1.0 到 10.0 间的所有浮点数，但不包括 10.0
('a'..'c').to_a # ['a', 'b', 'c']
```

#### 哈希(Hash)

Hash 是以`{}`表示的键值对数据结构，有两种定义方式：

```ruby
h = {'one' => 1, 'two' => '2'}
```

或 

```ruby
h = Hash.new
```

而如果键值以 symbol 来表示的话，可以简写成：

```ruby
h = {one: 1, two: 2} # {:one => 1, :two => 2}
```

#### 符号(Symbol)

符号(Symbol)可以理解为一种特殊的字符串对象，作为名称标签使用，用来表示方法等对象的名称，一般 hash 的键值会用符号来表示，比字符串更高效。符号和字符串可以互相转换：

```ruby
'ruby'.to_sym   # 转换为符号 :ruby
:ruby.to_s      # 转换为字符串 'ruby'
```

#### true, false, nil

true 和 false 为两个布尔型的值，与其他语言理解有差别的是，除了 false 和 nil 外，其他值都为 true:

```ruby
!true   # false
!false  # true
!nil    # true
!0      # false
![]     # false
```

nil 表示空值。对于值判空操作可调用 `nil?` 方法：

```ruby
true.nil?   # false
nil.nil?    # true
```

### 3. 表达式

#### 赋值

```ruby
x = 1
x += 1
x, y, z = 1, 2, 3
x, y = y, x       # 并行赋值，可以实现值交换
```

#### defined? 操作符

`defined?` 操作符可以判断变量、函数、符号等是否定义：如果右值定义，则返回一个字符串；否则为 nil. 

```ruby
y = f(x) if defined? f(x)

a = []
defined? a    # "local-variable"
defined? b    # nil
defined? nil  # "nil" 注意这里返回的是 "nil" 字符串
```

### 4. 条件及循环

#### if 和 unless

```ruby 
if x == 1
  name = "one"
elsif x == 2
  name = "two"
else
  name = "many"
end
```

或者更简洁的写法：

```ruby
name = if x == 1 then "one"
       elsif x == 2 then "two"
       else "many"
       end
```

注意，上述下面的写法中 `then` 不可省略。

另外，如果表达式只有一句，if 一般放在语句后面，更符合英语语法习惯：

```ruby
name = "one" if x == 1
```

`unless` 含义与 `if` 相反，相当于 if not. 

#### case

case 语句即 C 语言中的 switch/case:

```ruby
name = case
       when x == 1 then "one"
       when x == 2 then "two"
       else "many"
       end
```

与 `if` 语句类似， `when` 条件后的逻辑语句如果另起一行，可省略 `then`。


#### while 和 until

```ruby
x = 0
while x < 10 do
  puts x = x + 1
end
```

与 `if` 语句类似，如果循环处理语言只有一行，可将 `while` 条件放在语句结尾：

```ruby
x = 0
puts x = x + 1 while x < 10
```

或：

```ruby
x = 0
begin
  puts x = x + 1
end while x < 10
```

`until` 相当于 `while not`.


#### for/in

```ruby
for var in collection do
  body
end
```

#### 迭代器

虽然 Ruby 提供了 while/until/for 循环控制语句，但实际上在编程中使用不多。在 Ruby 编程中对循环处理逻辑使用更普遍的是迭代器(Iterator)的写法。如开头示例中的打印五次 'hello, world'。而一些 Enumerable 对象中提供的迭代器调用比使用 for 语句更简洁：

```ruby
data.each { |x| puts x }    # 打印 data 中每一个元素
[1, 2, 3].map { |x| x*x }   # 返回 [1, 4, 9]
```

除 Enumerable 类的迭代器外，Numeric 类也提供了几种迭代器方法：

```ruby
4.upto(6) { |x| puts x }    # 456
3.times { |x| puts x }      # 012
0.step(Math::PI, 0.1) { |x| puts x }  # 从0开始，每迭代步长0.1，直到大于等于 PI 值。
```

* 写一个迭代器

用 `yield` 关键字来调用迭代器处理的 block (`{}`中的语句): 

```ruby
def square(from, to)
  while from <= to
    yield from * from     # 调用 block, 并将值传入 block
    from += 1
  end
end

square(1, 4) { |x| puts x }
```

#### break, next, redo

* break: 从循环或迭代器中跳出。
* next: 从循环或迭代器中调到下一个循环处理。
* redo: 重新从循环或迭代器开头执行。

### 4. 异常处理

Ruby 中也有 `throw` 和 `catch` 关键字，但这两个配对主要是用在多层循环语句中直接跳出，类似于 C 语言中的 `goto`. Ruby 的异常处理使用 `raise/rescue/ensure`, 相当于 Java 中的 `try/catch/finally`.

```ruby
begin
  ...
rescue RuntimeError => e
  puts e.message
rescue => e
  puts "#{e.class}: #{e.message}"
ensure
  ...
end
```

如果 `begin` 在方法开始处，则 `begin` 可省略。

### 5. 方法(Method)

一般语言中会区分函数(function)和方法(method)，用于区分直接调用的函数和对象的方法。而 Ruby 是完全的面向对象，因此，所有的函数都是方法，如果没有定义在类或模块内部，那么会被作为 Object 的私有方法定义并调用。

#### 定义

以 `def` 关键字定义：

```ruby
def factorial(n)
  if n < 1
    raise "argument must be > 0"
  elsif n == 1
    1
  else
    n * factorial(n-1)
  end
end
```

方法中的 `return` 关键字可省略，除非提前条件退出的逻辑需加上 `return`.

调用方法时，可省略小括号`()`，如：

```ruby
factorial 10
```

#### 方法别名

```ruby
alias aka also_known_as   # aka 作为方法 also_known_as 的别名
```

#### 参数

方法支持默认参数：

```ruby
def prefix(s, len=1)
  s[0, len]
end
```

支持可变参数，参数作为数组使用：

```ruby
def max(first, *rest)
  max = first
  rest.each {|x| max = x if x > max}
  max
end

max 1       # first=1, rest=[]
max 1, 2, 3 # first=1, rest=[2, 3]
```

如果将数组作为参数传入方法，需要在数组变量前加 `*`:

```ruby
data = [3, 2, 1]
max 1, *data  # first=1, rest=[3, 2, 1]
max *data     # first=3, rest=[2, 1]
max data      # first=[3, 2, 1], rest=[]
```

如果哈希值作为最后一个参数，可以省略调用的 `{}`(这在 Rails 中应用非常广泛)：

```ruby
def sequence(args)
  m = args[:m] || 1
  n = args[:n] || 0
  ...
end

sequence m:3, n:5
```

但如果调用时加上`{}`, 需要同时带上 `()`, 否则会出错，因为 Ruby 会将 `{}` 当成 block 块：

```ruby
sequence {m:3, n:5}   # 语法错误
```

block 块作为参数：

TODO...

#### 名称约定

方法名后缀有些约定，方法名后跟 `?` 一般表示返回 true/false, 跟 `!` 表示该方法具有破坏性。这种后缀是一种约定而非强制。

`=` 后缀的方法将在赋值语句中调用，对应其他语言中的 setter 方法。

#### Proc, lambda

proc 和 lambda 都是闭包(closure)； TODO...

### 6. 类

#### 定义

类名需以大写字母开头：

```ruby
class Point
end
```

实例化对象：

```ruby
p = Point.new
```

#### 成员变量及成员方法

成员变量名以 `@` 开头，类变量名以 `@@` 开头。

类的构造函数名称为 `initialize`。

```ruby
class Point
  def initialize(x, y)
    @x, @y = x, y
  end

  def x; @x; end  # @x 的 getter 方法
  def y; @y; end

  def x=(value)   # @x 的 setter 方法
    @x = value
  end

  def y=(value)
    @y = value
  end
```

上面的实现在 ruby 中有更简洁的语法可以自动生成 getter 和 setter 方法功能：

```ruby
class Point
  attr_accessor :x, :y

  def initialize(x, y)
    @x, @y = x, y
  end
end
```

如果是只读成员变量仅提供 getter 方法的话可以使用 `attr_reader` 关键字：

```ruby
attr_reader :x
```

#### 运算符方法

对类实现运算符方法，如 `+-*/`, 需要注意的是由于一元`-`运算符(求负)与减法预算负是同一个字符，因此，Ruby 使用 `-@` 来表示一元`-`运算符方法：

```ruby
Class Point
  ...
  def +(other)
    Point.new(@x + other.x, @y + other.y)
  end

  def -@
    Point.new(-@x, -@y)
  end

  def *(scalar)
    Point.new(@x*scalar, @y*scalar)
  end
end
```

#### 类方法

类方法定义与成员方法定义不同在方法名前加类名或 `self` 关键字：

```ruby
class Point
  def Point.sum(*points)
    ...
  end

  def self.top(*points)
    ...
  end
end
```

如果有多个类方法定义，可将它们放一起，如下方式定义：

```ruby
class Point
  class << self     # self 也可以用类名 Point 替代
    def sum(*points)
      ...
    end

    def top(*points)
      ...
    end
  end
end
```

#### public, protected, private

方法默认为 `public`, protected, private 的方法需要显示声明：

```ruby
class Point
  # 以下是 public 方法
  ...
  protected # 以下是 protected 方法
  ...
  private   # 以下是 private 方法
  ...
end
```

#### 继承

类的继承用符号 `<`，继承特性与其他面向对象语言类似，方法可被子类重写，重写方法如果需要调用父类方法，可使用 `super` 关键字来调用。

```ruby
class Point3D < Point
  def initialize(x,y,z)
    super(x,y)
    @z = z
  end
end
```

### 7. 模块(Module)

Ruby 的模块(Module) 类似于其他语言的命名空间，但又提供了 Mixin 功能供其他类导入方法，可以理解成实现了方法的接口。

模块不能被实例化，不能被继承。

#### 用作命名空间(namespace)

```ruby
module Base64
  class Encoder
    ...
  end

  class Decoder
    ...
  end

  # 模块公共方法，可以被内部的类调用
  def Base64.helper 
    ...
  end
end
```

#### 用作 Mixin

前面提到的 Enumerable 对象的类其实就是 Mixin 了 Enumerable Module. 使用 `include` 关键字 mixin 模块，便可将该模块的所有方法导入进类中。一个模块也可以 mixin 其他模块。

```ruby
class Point
  include Enumerable, Comparable
  ...
end
```

### 8. 其他语法



## 元编程

Ruby 提供了丰富的反射接口，这使得 Ruby 元编程非常容易，Ruby on Rails 框架正是利用了这一特性，构建了一套 Rails 的 DSL. 

### 类型

Ruby 提供了多种获取、比较类型的方法：

```ruby
a = []
a.class           # Array, 获取对象的类 
Array.superclass  # Object, 获取类的父类 
a.instance_of? Array  # true,
a.is_a? Array         # true, 与 instance_of? 的区别是 is_a? 父类或祖先类也为 true
a.kind_a? Array       # true, kind_a? 与 is_a? 是一个意思
Array === a           # true
a.respond_to? :include? # true, 判断是否有该方法
```

### eval 方法执行字符串

```ruby
x = 1
eval "x + 1"    # 2
```

### 方法

通过 `send` 调用，将方法名作为 symbol 或字符串传给对象调用：

```ruby
"hello".send :upcase     # 等同于 "hello".upcase
```

`define_method` 和 `method_missing` 是元编程较为常用的两个方法，`define_method` 可以动态定义函数，而 `method_missing` 则是在对象调用时没有查到方法时调用的方法。

## 项目应用

### Gem, Bundler

Ruby 的包称为ruby gem, 包管理工具也是 gem. 而对于包依赖管理则是 bundler 来进行管理，在项目目录生成一个 Gemfile 文件，执行 `bundle install` 来自动安装依赖包。Gemfile 文件是这个样子：

```gemfile
source 'https://rubygems.org'

gem 'rails', '4.1.0.rc2'
gem 'rack-cache'
gem 'nokogiri', '~> 1.6.1'
```

### testing

Ruby 的默认单元测试框架是 Test::Unit, 也可以换成如 rspec 之类。

### rubocop

由于 Ruby 提供了丰富的语法，导致项目开发时可能会出现风格迥异的情况，因此，一些大型项目会定义 Ruby 的编程风格(code style)，比较知名的有 airbnb 的 Ruby Style Guide.[^3]

而工具检查方面，robocop 静态检查工具可以很好的检查 Code Style 的符合情况，另外，rubocop 也可以检查代码中的其他一些问题。

## 设计哲学

### 1. 让程序员享受编程的乐趣

Matz 认为编程语言首先应该是给程序员服务的。因此在 Ruby 首先考虑的是提升程序员的效率，让程序员满意，而非一味从服务器运行效率等机器角度考虑设计。

> 人们特别是电脑工程师们，常常从机器着想。他们认为：“这样做，机器就能运行的更快；这样做，机器运行效率更高；这样做，机器就会怎样怎样怎样。”实际上，我们需要从人的角度考虑问题，人们怎样编写程序或者怎样使用机器上应用程序。我们是主人，他们是仆人。[^4]

Ruby 继承了 Perl 的设计原则（TMTOWTDI: There's More Than One Way To Do It），提供了处理同样事务的多种方法。这与 Python 的只提供一种解决方法的设计思想(Zen of python: There should be one-- and preferably only one --obvious way to do it)恰恰相反。对于程序员而言，Ruby 更自由、更灵活，但也会导致多人项目的代码风格迥异，可读性不如 python 代码。

就我个人而言，Ruby 编程确实很有意思，一方面是 Ruby 可以用很少量的代码实现更多的功能，另一方面是能想到的功能基本上没有什么语法限制，都可以实现。

### 2. 最小惊讶原则(POLA: principle of least astonishment)

Matz 认为编程语言应该尽可能符合程序员的预期，也就是所谓的“最小惊讶原则”。有一个典型的例子，如果在 python 的终端交互界面上输入 exit, python 会提示让你加括号，可是既然编程语言都判断出用户想退出了，为什么还需要让用户再次输入精确的命令呢？相反的，在 irb 上输入 exit, quit 都可以实现用户的预期 —— 退出交互终端。

```shell
$ irb
irb(main):001:0> exit
$ irb
irb(main):001:0> quit


$ python
>>> exit
Use exit() or Ctrl-D (i.e. EOF) to exit
```

不过 Ruby 里也有让人“惊讶”的地方，最为诟病的一点是关于布尔判断，在 Ruby 里面，除了 false 和 nil 被判断为 false 外，其他都为 true, 包括 0, [], 这与很多语言的布尔判断约定是不一样的。

### 3. 一切皆对象

Ruby 是存粹的面向对象语言，上述语法也说明了这一点。

当然 Ruby 也比较有争议性，喜欢的人很喜欢，不喜欢的人理由也有千千条。但对于喜欢 Ruby 的人来说，Ruby 的缺点都不算缺点，正如 Ruby on Rails 的创始人 dhh 最近在 Twitter 上说：
"Ruby was fast enough in 2003 to build a business like Basecamp with no impediments." 尽管2003年的 Ruby 是被吐槽出奇慢的 1.8 版本。

************

[^1]: *The Ruby Programming Languange*: https://book.douban.com/subject/2337297/
[^2]: Ruby official: https://www.ruby-lang.org/
[^3]: Airbnb's Ruby Style Guide: https://github.com/airbnb/ruby
[^4]: The Philosophy of Ruby - A Conversation with Yukihiro Matsumoto, Part I: https://www.artima.com/intv/ruby.html

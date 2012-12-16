---
layout: post
title: 《Effective C++》(3rd Edition) 笔记
---

{{ page.title }}
================

<p class="meta">2 Dec 2012 Shanghai </p>


Chapter 1: Accustoming Yourself to C++
--------------------------------------

###Item 1: View C++ as a federation of languages ###

与其说C++是一种语言，不如说它是一种语言联合。学习C++包含如下部分：

* C: 毋庸多说
* Object-Oriented C++: 类，继承，封装，多态
* Template C++: 泛型
* The STL

###Item 2: Prefer consts, enums, and inlines to #define ###

###Item 3: Use consts whenever possible ###

###Item 4: Make sure that objects are initialized before they're used ###


Chapter 2: Constructors, Destructors, and Assignment Operators
--------------------------------------------------------------

###Item 5: Know what functions C++ silently writes and calls ###

默认创建： default constructor, copy constructor, copy assignment operator and destructor

如果不想要编译器默认创建的这些函数，那么要显示禁止它们。(Item 6)

###Item 6: Explicitly disallow the use of compiler-generated functions you do not want ###

###Item 7: Declare destructors virtual in polymorphic base classes ###

虚函数有性能耗用的成本，但如果继承基类，那么基类的析构函数就要是虚的。

###Item 8: Prevent exceptions from leaving destructors ###

由于析构函数的调用机制（参见Item 7），析构函数不应该抛出异常（否则会导致后续的析构函数无法被调用）。而是析构函数catch所有的异常，然后：1) terminate program 或者 2) swallow the exception. 

###Item 9: Never call virtual functions during construction or destruction ###

千万不要在构造函数或析构函数中调用虚函数...

###Item 10: Have assignment operators return a reference to *this ###

好处：链式赋值。

###Item 11: Handle assignment to self in operator= ###

这是个C++陷阱：将自己赋值给自己，如果按照普通的做法，先将自己delete再new再copy的话，源已经被delete掉了...

解决方案： 1) 比较源和目的对象的地址是否相同 或 2) copy-and-swap (copy to temp)

###Item 12: Copy all parts of an object ###

copy函数应该拷贝对象所有的成员，包括基类的成员。

不要让copy函数去调用其他的copy函数来减少重复，而应该提取公共函数。


Chapter 3: Resource Management
------------------------------

###Item 13: Use objects to manage resource ###

防止内存泄漏，使用RAII(Resource Acquisition Is Initialization)对象

两个有用的RAII类： tr1::shared_ptr (推荐) 和 auto_ptr.

###Item 14: Think carefully about copying behavior in resource-managing classes ###

RAII类要防止copy问题，一般的解决办法是disallowing copying 或 引用计数。

###Item 15: Provide access to raw resources in resource-managing classes ###

###Item 16: Use the same form in corresponding uses of new and delete ###

new 对 delete; new[] 对 delete[]

###Item 17: Store newed objects in smart pointers in standalone statements ###

如：

	processWidget(std::tr1::shared_ptr<Widget>(new Widget), priority());

编译器会生成代码做三件事：

* Call priority.
* Execute "new Widget".
* Call the tr1::shared_ptr constructor.

但编译器生成代码时可能会做一些优化，这三件事的顺序未知，可能是：

1. Execute "new Widget".
2. Call priority.
3. Call the tr1::shared_ptr constructor.

如果在第二步时发生异常，那么第三步将不会被调用，而第一步new的内存将得不到shared_ptr的自动释放。代码应该优化成： 

	std::tr1::shared_ptr<Widget> pw(new Widget);
	processWidget(pw, priority());


Chapter 4: Designs and Declarations
-----------------------------------

###Item 18: Make interfaces easy to use correctly and hard to use incorrectly ###

###Item 19: Treat class design as type design ###

设计一个新类前，要多考虑：需要吗？

###Item 20: Prefer pass-by-reference-to-const to pass-by-value ###

传引用比传值性能更高；但对于built-in type、STL iterator或function object type，后者更高。

###Item 21: Don't try to return a reference when you must return an object ###

新手易犯的一个错误。

###Item 22: Declare data members private ###

将成员变量声明为private; protected并不比public更具有封装性，后二者都应该避免。

###Item 23: Prefer non-member non-friend functions to member functions ###

###Item 24: Declare non-member functions when type conversions should apply to all parameters ###

?

###Item 25: Consider support for a non-throwing swap ###

using std::swap ... ?



Chapter 5: Implementations
--------------------------

###Item 26: Postpone variable definitions as long as possible ###

1. 清晰
2. 高效


###Item 27: Minimize casting ###

1. 避免cast.
2. 用C++风格代替C风格cast.

###Item 28: Avoid returning "handlers" to object internals ###

###Item 29: Strive for exception-safe code ###

注意异常造成的影响。

###Item 30: Understanding the ins and outs of inlining ###

1. inline的好处和负面效应
2. 不要将template函数声明为inline

###Item 31: Minimize complication dependencies between files ###



Chapter 6: Inheritance and Object-Oriented Design
-------------------------------------------------

###Item 32: Make sure public inheritance models "is-a" ###


###Item 33: Avoid hiding inherited names ###

1. 子类会隐藏base class的命名
2. 使用using 来显示隐藏的命名

###Item 34: Differentiate between inheritance of interface and inheritance of implementation ###

###Item 35: Consider alternatives to virtual functions ###

1. use Template Method design pattern, such as NVI idiom (non-virtual interface idiom)
2. use Strategy design pattern, such as function pointer data menbers, tr1::function ...

###Item 36: Never redefine an inherited non-virtual function ###

###Item 37: Never redefine a function's inherited default parameter value ###

缺省参数是静态绑定的

###Item 38: Model "has-a" or "is-implemented-in-terms-of" through composition ###

组合优于继承

###Item 39: Use private inheritance judiciously ###

私有继承意味着"is-implemented-in-terms-of", 不如用组合。当然，私有继承有它的好处： 可以redefine基类protected方法; 可以优化空基类使得占用空间更小

###Item 40: Use multiple inheritance judiciously ###



Chapter 7: Templates and Generic Programming
--------------------------------------------

###Item 41: Understand implicit interfaces and compile-time polymorphism ###

class和template都支持interface和polymorphism, 只不过template的多态发生在编译期

###Item 42: Understand the two meanings of typename ###

class和template都可以作为template的关键字，但在nested type情况如下只能用typename:

	template<typename C>                     // typename allowed (as is "class")
	void f(const C& container,               // typename not allowed
	       typename C::iterator iter);       // typename required


###Item 43: Know how to access names in templatized base classes ###

In derived class templates, refer to names in base class templates via a "this->" prefix, via "using" declarations, or via an explicit base class qualification.

###Item 44: Factor parameter-independent code out of templates ###

template 会导致代码膨胀, 防止：

	template<typename T,
	         std::size_t n>
	class SquareMatrix {
		...
	}

###Item 45: Use member function templates to accept "all compatible types" ###

....

###Item 46: Define non-member functions inside templates when type conversions are desired ###

....

###Item 47: Use traits class for information about types ###

....

###Item 48: Be aware of template metaprogramming ###



Chapter 8: Customizing new and delete
-------------------------------------

###Item 49: Understand the behavior of the new-handler ###


###Item 50: Understand when it makes sense to replace new and delete ###


###Item 51: Adhere to convention when writing new and delete ###


###Item 52: Write placement delete if you write placement new ###



Chapter 9: Miscellary
---------------------

###Item 53: Pay attention to compiler warnings ###


###Item 54: Familiarize yourself with the standard library, including TR1 ###


###Item 55: Familiarize yourself with Boost ###


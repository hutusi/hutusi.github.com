---
layout: post
category: tech
tags: [refactor]
title: 对算法的重构
---

{{ page.title }}
================

<p class="meta">8 Jul 2012 Shanghai </p>

重构是改善代码的方法，使用重构来让代码变得更优美、架构变得更松耦合，而对于算法，需不需要重构呢？答案明显是肯定的。改善算法，就是让算法变得更高效，实现算法的代码更容易理解，逻辑更清晰。（当然，代码的优美也是重要的。）

试举一例。

[Project Euler](http://projecteuler.net/)上有道题（第三题），题目描述：

	The prime factors of 13195 are 5, 7, 13 and 29.

	13195的质数因子分别为5， 7， 13 和29.

	What is the largest prime factor of the number 600851475143 ?

	试问数字600851475143的最大质数因子是多少？

题目看上去很简单，只要了解质数、合数的定义即可。首先，我便用了最容易想到的办法写了实现：从2到该数（设为n）前一数（600851475143 - 1）循环遍历，假设为f，如果n可以被f整除，且f是质数，则f为质数因子，依次找出最大的数。

代码如下（加上`Benchmark`是为了测试程序执行时间。）

	require "benchmark"

	def is_prime? num
		2.upto(num - 1).each do |x|
			return false if num % x == 0
		end
		true
	end

	def max_prime_factor_of num
		max_prime = 0
		2.upto(num - 1).each do |x|
			max_prime = x if num % x == 0 and is_prime? x and max_prime < x
		end
		max_prime
	end
	
	puts Benchmark.measure { puts max_prime_factor_of 600851475143 }

这种办法在有限的时间内根本没法完成，于是做了下优化，对于 a * b = n, 如果a趋近于小，那么b便趋近于大。那么，a从2开始尝试，如果a可被n整除，b = n / a，如果b是质数即为最大质因子。

	def max_prime_factor_of num
		2.upto(num - 1).each do |x|
			return num/x if num % x == 0 and is_prime? num/x 
		end
	end

可以算出正确答案是`6857`， 但耗费时间还是太长，需要好几分钟才能算出结果。这样的结果显然是不能接受的，于是开始思考如何对这个算法作重构，以使程序执行时间缩短。

首先考虑判断某个数是否为质数这个函数，a * b = n， 如果 a <= √n, 则 b >= √n, 所以只要尝试到 √n 即可，程序可以优化成： 

	def is_prime? num
		root = Math.sqrt num
		2.upto(root).each do |x|
			return false if num % x == 0
		end
		true
	end

效率有所上升，但仍不理想。看看程序，关键在于 600851475143 这个数太大了，循环这么多次很耗时，有没有办法从这里做文章呢？ 想想质数的定义，质数就是除了1和自身不能被别的数整除的数，而一个合数和可以分解为若干个质数。即合数 n = a * b * c * ... abc是相同或不相同的质数。那么从最小的质数2开始，除合数，若不能除，则跳到下一个较大的质数再试；若能除，则将商继续除去质数，最后得到不能在整除的数即是最大质因子。

从2开始，如果n % 2 == 0，那么商数quo = n / 2；继续，如果 quo % 2 == 0，则quo = quo / 2，直到不能被2 整除；再整除3， 3之后的自然数是4，而下一个质数是5，如果再写一个得到下一个质数的函数有点费事（虽然有些语言包含的数学库中提供了此方法），我们可直接用4尝试，而用来除4的商数是不能被2整除的数，所以肯定不能被4整除，自然跳到了下一个质数5. 后续的合数同理。于是，可以得到新的代码：

	def max_prime_factor_of num
		divisor, quotient = 2, num
		while quotient > 1
			if 0 == (quotient % divisor)
				quotient /= divisor
			else
				divisor += 1
			end
		end
		divisor
	end

最后一个商其实是可以不必除的，即 

	def max_prime_factor_of num
		divisor, quotient = 2, num
		while quotient > divisor
			(quotient % divisor == 0) ? (quotient /= divisor) : (divisor += 1)
		end
		divisor
	end

可以看出，最后一个循环时，`divisor` 在试探是否可以被 `quotient` 整除时一直+1试探到 `quotient`，如果`quotient`是质数则最后因`divisor == quotient` 跳出循环。根据前面对质数的优化，没有必要一直试探到`quotient`, 只要到 `√quotient` 即可，即循环判断可以改为 `√quotient > divisor`, 或换成效率更高的乘法 `quotient > divisor * divisor` :

	def max_prime_factor_of num
		divisor, quotient = 2, num
		while quotient > divisor * divisor
			(quotient % divisor == 0) ? (quotient /= divisor) : (divisor += 1)
		end
		quotient
	end

最后这一点重构虽然看似提升很小，但对于一些更大数量级的数效果就很明显了。如10倍或100倍以上的 6000851475143 或 60000851475143 。

从上述重构例子我总结了几点：

1. 不好的算法会影响性能。一个用c++写的不好的算法程序可能比ruby写的好的算法程序要慢的多，同理，一个自以为少些几个函数就可以提高性能的想法是不足取的。而如果这些算法出现在关键路径上，更是会严重拖慢程序运行。

2. 越简单的逻辑往往性能更高。当然，要想到这个简单的逻辑过程并不一定简单。如果没有很好的数学头脑怎么办？问，查。问身边的高手，上网上查。[Google](https://www.google.com/)或是[stackoverflow](http://stackoverflow.com/)，特别是后一个，严重推荐给程序员。

3. 重构算法时不能将代码变丑。我从不认为为了少调用函数而将函数变长或使用大量if/else等而不是多态等技术的做法是可取的，这些都不是提高性能的关键。原因如1所说，没有找到根本原因而已。高效的算法一定要搭配优雅的代码才算好。否则，一辆泼满大粪的法拉利也没人愿意去坐是不。

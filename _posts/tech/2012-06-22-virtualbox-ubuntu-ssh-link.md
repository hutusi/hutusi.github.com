---
layout: post
category: tech
tags: [ubuntu]
title: 在Virtualbox安装的ubuntu server建立ssh连接及安装增强包
---

{{ page.title }}
================

<p class="meta">22 Jun 2012 Shanghai </p>

在virtualbox的ubuntu server中建立ssh服务
----------------------------------------

在virtualbox上的属性设置中，Network页签设置如下：
![virtualbox 属性设置](/assets/images/posts/vbox-adapter2.png)

然后，需要在ubuntu中设置以太网口1: 编辑 /etc/network/interfaces , 增加下述配置：

<pre><code>	auto eth1
	iface eth1 inet static
		address 192.168.56.10
		netmask 255.255.255.0
</code></pre>

保存后运行如下命令生效eth1 ：

`sudo ifup eth1`

这样，在终端中可以通过ssh命令连接ubuntu了：

`ssh john@192.168.56.10`


在ubuntu server上安装virtualbox增强包
-------------------------------------

在ubuntu x-window界面上安装增强包很容易，在只有命令行的server上怎么安装呢？

1. 首先，在virtualbox菜单栏选择 设备-> 安装增强功能

2. 安装以下的包：
   `sudo apt-get install build-essential linux-headers-$(uname -r) -y` 

3. 挂载cd-rom: 
   `sudo mount /dev/cdrom /mnt/`

4. 安装增强包
   `sudo /mnt/VBoxLinuxAdditions-x86.run`

5. 卸载cdrom
   `sudo umount /mnt/`

6. 共享windows中的文件
   `sudo mount -t vboxsf sharedfiles /mnt/shared`


参考
----

1. [Howto: SSH into VirtualBox 3 Linux Guests](http://muffinresearch.co.uk/archives/2010/02/08/howto-ssh-into-virtualbox-3-linux-guests/)

2. [ubuntu server 在 virtualbox中安装增强包](http://luzl.iteye.com/blog/1010597)

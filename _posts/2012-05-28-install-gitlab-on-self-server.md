---
layout: post
title: 搭建GitLab服务器
---

{{ page.title }}
================

<p class="meta">28 May 2012 Shanghai </p>

闲来无事，在公司搞了太服务器装了Ubuntu Server 12.04，然后试着搭建了GitLab服务；下面记录下搭建时遇到的一些问题和解决办法。

基本过程按照 Gitlab 的官方安装文档逐步操作即可： [https://github.com/gitlabhq/gitlabhq/blob/stable/doc/installation.md](https://github.com/gitlabhq/gitlabhq/blob/stable/doc/installation.md)；只不过有些地方要注意下：

+ 第6步，需要用sudo权限执行批处理： `sudo ./resque.sh`
+ 最后执行`sudo insserv gitlab` 的时候会报错说 `command not found`，网上查了下，有一篇说这是ubuntu的一个bug，需要执行`$sudo ln -s /usr/lib/insserv/insserv /sbin/insserv`
+ nginx配置中，如果没有域名希望直接用ip访问，那么需要将如下行注释掉: 

	proxy_redirect     off;
	# you need to change this to "https", if you set "ssl" directive to "on"
	proxy_set_header   X-FORWARDED_PROTO http;
	proxy_set_header   Host              gitlab.YOUR_SUBDOMAIN.com:80;
	proxy_set_header   X-Real-IP         $remote_addr;


另外，由于公司不能直接连外网，需要通过proxy，而在linux下配置proxy也比较麻烦，每种工具配置方法都不一样，下面也列举一二：

+ apt-get: 在 /etc/apt/apt.conf 配置 `Acquire::http::Proxy "http://yourid:yourpassword@yourproxyaddress:proxyport";`
+ wget: 在 ~/.wgetrc 中配置:

	http_proxy = http://yourid:yourpassword@yourproxyaddress:proxyport/
	https_proxy = http://yourid:yourpassword@yourproxyaddress:proxyport/
	ftp_proxy = http://yourid:yourpassword@yourproxyaddress:proxyport/
	use_proxy = on

+ gem: 在 ~/.gemrc 中配置:

	http_proxy = http://yourid:yourpassword@yourproxyaddress:proxyport/
	https_proxy = http://yourid:yourpassword@yourproxyaddress:proxyport/

但奇怪的是设置了gem的proxy后，使用`gen install gem_source`是可以安装gem的，但使用bundle却不能，所以最后只要从家里的机器上将gem的cache拷贝到了公司服务器上，然后使用--local方式进行bundle安装: `sudo -u gitlab -H bundle install --without development test --deployment --local`


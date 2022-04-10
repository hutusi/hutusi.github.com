---
layout: post
category: tech
tags: 博客 nginx
title: 自建博客 Nginx 基本配置
subtitle: 从一个 Nginx 配置问题学到的
date: "2022-04-10 11:11:00 +0800"
---

本博客虽然是静态博客，为了提升国内访问速度，从 GitHub Pages 上迁到了云主机，用 Nginx 搭建的静态网站服务。最近在整理博客站点时发现如果输错 URL 不是返回404页面，而是返回500错误，经定位发现是 Nginx 配置的问题。因此周末花了一天时间好好看了下 Nginx 相关配置指导，正好也做一个学习总结。末尾我会说明下这个问题以及修复方法。

### Nginx 介绍

Nginx 是俄罗斯程序员 Igor Sysoev 于2004年开发的 web 服务器软件。2019年 Nginx 被 F5 以6.7亿美元的架构收购。有两件关于 Nginx 的知名新闻，一则是2019年 Rambler 公司（也是 Igor 开发 Nginx 时所服务的公司）起诉 Igor 及 F5 公司，声称他们侵犯了 Rambler 的知识产权。该事件引发 IT 界强烈争议而后变成“协商解决”而暂停。另一则是前段时间俄罗斯出兵乌克兰，F5 宣布从俄罗斯撤出业务并停止接纳俄罗斯对 Nginx 开源贡献。

Nginx 目前已超过 Apache 成为占有率最高的 web 服务器软件，市场占有率超过30%，相对老牌的 IIS 和 Apache 发展速度很快。

![nginx market share]({{site.images_baseurl}}/posts/nginx-apache-market-share.png){:width="600px"}

Nginx 可以做静态站点 HTTP/HTTPS 服务、反向代理、负载均衡。关于反向代理(Reverse Proxy)解释如下图示：我们在访问互联网时可以设置代理(Proxy)，这样客户端对互联网的请求和数据接收是通过这个代理转发的。而所谓反向代理则是来转发互联网上用户对服务器的请求，Nginx 则提供了灵活的配置和高效的转发能力。

![proxy-vs-reverse-proxy]({{site.images_baseurl}}/posts/proxy-vs-reverse-proxy.png){:width="600px"}

## 安装及配置

通过包管理工具很容易安装 Nginx, 如 Ubuntu: `sudo apt install nginx` 或 Mac: `brew install nginx`. 安装好后启动 Nginx 服务，即可以通过服务器 IP 访问 Nginx 服务。

### Nginx 配置文件结构

打开 Nginx 安装目录可以看到 Nginx 的配置文件 `nginx.conf` ，一般在 `/etc/nginx` 路径下。Nginx 配置脚本中 `#` 开头为注释，其他为配置指令（Nginx 术语为 directive）。

```bash
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       8080;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }
    }

    include servers/*;
}
```

Nginx 配置文件主要分成三块(Nginx 术语叫 context)：全局块(main context)、events 块、http 块。events 块 和 http 块都被包含在 `{}` 中，没有没包含在 `{}` 中的配置指令就是全局块的内容。

全局块中主要是一些 Nginx 服务器的全局配置指令，如 log 日志存放位置、Nginx PID 文件路径、Nginx 运行 worker 进程数等。如上例中从配置文件开头到 `events` 块之间的内容为全局块（大部分被注释）。

events 块中配置影响 Nginx 服务器与用户的网络连接性能。如上例中 `worker_connections  1024` 表示一个 worker process 最大的连接数为1024，注意这个数字不能超过系统支持打开的最大文件数，也不能超过单个进程支持打开的最大文件数。

> 查看 Linux 下打开文件数限制：`cat /proc/sys/fs/file-nr ` 。修改文件 `/etc/sysctl.conf` 。
> 
> 查看 Linux 下单进程打开文件数限制：`ulimit -n` 。 修改文件：`/etc/security/limits.conf` 。
> 

搭建博客服务器主要需要修改 http 块中的配置指令。

### http 块配置

http 块中还可以包含  server 块，除此之外是 http 块的全局配置，包含连接超时时间、cache设置、传输文件压缩配置等。

上例中 `include servers/*` 表示可以将 servers 目录下的配置文件都包含进来，如果有多个服务配置，可以将这些配置分布在不同配置文件中，便于管理。

Server 块的典型配置如：

```bash
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name  hutusi.com www.hutusi.com;

    root /var/www/blog;
    location / {
        index  index.html index.htm;
    }

    error_page 404 /404.html;
    # redirect server error pages to the static page /50x.html
    error_page   500 502 503 504  /50x.html;
```

`listen` 指令表示服务监听的IP 和端口， `default_server` 表明这个 server 块是默认的服务。

例如 `listen 127.0.0.1` 表示只监听来自 127.0.0.1 这个 IP 并请求80端口的请求（不指定端口则默认为 80）；而 `listen 8080` 表示监听来自所有 IP 并请求 8080 端口的请求。

第二行的 `listen [::]:80` 表示支持 IPv6，监听来自于 IPv6 的连接。

`server_name` 指令配置虚拟主机的名称，可以有多个名称并列，如：

```bash
server_name hutusi.com www.hutusi.com;
server_name localhost;   # 注意：这里的 localhost 与上面 listen 中的 localhost 含义是不一样的
```

`root` 指令配置请求寻找资源的根目录；该指令可以在 http、server 或 location 块中设置，一般在 server 和 location 块中设置。

`error_page` 指令设置自定义错误页面来代替 Nginx 默认提供的错误界面，比如例子中的`error_page 404 /404.html` 表示用根目录的 `404.html` 页面来作为 404 页面。

### location 块配置

配置最为灵活的是 location 块，它表示了 Nginx 对于不同 URI 请求的特定处理配置，按 URI 的规则匹配来处理。语法规则如下：

```bash
location [ = | ~ | ~* | ^~ ] uri { ... }
```

location 中的 uri 有两种，一种是字符串前缀，一种是正则表达式。上述语法中 `[]` 方括号中为修饰可选项，其中 `=` 和 `^~ ` 使用字符串前缀，`~` 和 `~*` 使用正则表达式。如果不加该可修饰， Nginx 会将配置 uri 当做字符串前缀与请求 URI 进行匹配。

在定义了一组 location 时，Nginx 的匹配过程如下：

Nginx 首先检查使用前缀字符串定义的 location。在这些 location 中，具有最长匹配前缀的 location 被选中并被记住。然后检查正则表达式，按照它们在配置文件中出现的顺序。正则表达式的搜索在第一次匹配时终止，并使用相应的 location。如果没有找到匹配的正则表达式，那么就使用先前记忆的最长匹配前缀的 location。

 Nginx 对 location 的匹配规则优先级如下：

- 精确匹配 **`=` ：**请求的 URI 与 location 块中配置的 uri 完全一致，如果匹配则立刻停止向下搜索并使用该 location 处理。注意该匹配会忽略 URL 中的 querystring (即 ? 及之后的部分)
- 前缀匹配 **`^~` ：**如果最长匹配前缀找到的是这个 location，那么就使用该 location 并立刻停止后续的正则搜索。
- 按配置文件中的顺序进行正则匹配 **`~` （**区分大小写**）**或**`~*` （**不区分大小写**）。**
- 匹配不带任何修饰的前缀匹配。

### SSL 配置

博客网站需要支持 HTTPS 协议的话需要对有 SSL 证书并且在 Nginx 上做 SSL 配置。（如果用的是 GitHub Pages 或 Netlify 等服务就不用这么费事了。）证书可以在云厂商免费申请，或用 Let’s Encrypt 生成，这里就不赘述。证书下载后，可以开始 Nginx SSL 配置。

在配置文件中增加一个 SSL server 块：

```bash
server {
    listen 443 ssl http2 default_server;
    listen [::]:443 ssl http2 default_server;
    server_name  hutusi.com www.hutusi.com;
    
    ssl_certificate cert/hutusi.com.pem;
    ssl_certificate_key cert/hutusi.com-key.pem;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout  10m;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    root /var/www/blog;
    location / {
        index  index.html index.htm;
    }
    
    error_page 404 /404.html;
}
```

可以看出，除了listen 指令和增加了 SSL 指令部分外，其他跟非 SSL 配置是一样的。

`listen 443 ssl http2` 监听 SSL 默认端口 443，以及支持 HTTP/2 协议。

增加的几行 SSL 配置指令：

`ssl_certificate` 和 `ssl_certificate_key` 分别指定证书和证书私钥所存放的位置。

`ssl_session_cache` 和 `ssl_session_timeout` 设置 session 缓存大小和超时时间。

`ssl_ciphers` 设置选择加密算法套件，其中 `!aNULL`  和 `!MD5` 前面的 ! 表明不选用 aNULL 和 MD5 类算法套件，而 `HIGH` 代表了一组高强度加密算法，可以通过如下命令查看算法清单：

```bash
$ openssl ciphers -V 'HIGH'
          0xCC,0xA9 - ECDHE-ECDSA-CHACHA20-POLY1305 TLSv1.2 Kx=ECDH     Au=ECDSA Enc=ChaCha20-Poly1305 Mac=AEAD
          0xCC,0xA8 - ECDHE-RSA-CHACHA20-POLY1305 TLSv1.2 Kx=ECDH     Au=RSA  Enc=ChaCha20-Poly1305 Mac=AEAD
          0xCC,0xAA - DHE-RSA-CHACHA20-POLY1305 TLSv1.2 Kx=DH       Au=RSA  Enc=ChaCha20-Poly1305 Mac=AEAD
          ......
```

`ssl_prefer_server_ciphers on` 表明设置协商加密算法时，优先使用服务端的加密套件，而不是客户端浏览器的加密套件。

如果想让用户访问 [http](http://hutusi.com) 链接也指向 https 时，需要在监听 80 的 server 块配置 rewrite 或 return 301 重定向（return 301 性能更优一些）。

```bash
server {
    listen 80;
    listen [::]:80;
    server_name hutusi.com www.hutusi.com;
    return 301 https://hutusi.com$request_uri;
}
```

## 本地调试

本机安装 Nginx 就可以配置静态服务器进行调试，Mac 和 Linux 都比较方便。只是如果要配置 SSL 的话需要用到 `mkcert` 这个工具来制作本地签名证书。在 Mac 下通过命令 `brew install mkcert` 安装，然后运行命令 `mkcert -install` 来创建本地 CA（授权中心），并将该 CA 加入本机可信 CA （需要管理员账号授权）。

接着，就可以生成多域名证书了，该证书会输出到当前目录下。Nginx 调试中可以直接使用此证书。

```bash
$ mkcert example.com "*.example.com" example.test localhost 127.0.0.1 ::1
```

## 问题实例

### 问题描述

访问不存在的页面时返回的不是 404 页面而是 500 错误页面，比如浏览器中输入 [https://hutusi.com/hello](https://hutusi.com/hello) 则返回 500 错误。

### 问题原因

查看 Nginx 日志，发现报了这条错误：

```bash
2022/04/09 11:29:01 [error] 1683343#1683343: *49420 rewrite or internal redirection cycle while processing "////////////hello.html.html.html.html.html.html.html.html.html.html.html", client: 101.228.159.74, server: hutusi.com, request: "GET /hello HTTP/2.0", host: "hutusi.com"
```

大概是 rewrite 进入死循环了。打开配置文件，发现是这么写的：

```bash
location / {
    # Rewrite .html
    if (!-e $request_filename) {
        rewrite ^(.*)$ /$1.html last;
    }
}
```

这里的逻辑：如果找不到页面（if 条件），则重定向到新地址（在原地址后追加 `.html`）。其中，`rewrite` 指令的前两个参数分别是原 URI 和替换后的 URI，`^(.*)$ ` 和 `$1` 都是正则和正则替换语法。最后的参数 `last` 表示停止处理当前的 rewrite 并开始根据替换后的 URI 搜索新的 location 匹配。

原来这样配置的目的主要是因为博客文章生成的 URL 为 `[https://hutusi.com/articles/rms](https://hutusi.com/articles/rms).html` 这样，而我不想再访问时加 `.html` ，希望更简洁的 URL 类似 `https://hutusi.com/articles/rms` ，因此加了这段 rewrite 配置在匹配不到 URL 时重定向到追加了 `.html` 的 URL 页面。但当访问到真不存在的 URL 时，根据逻辑将追加 `.html` ，依然匹配不到，再继续追加，也就导致了死循环错误。

### 解决方法

找到原因，解决方法就很简单了，不再用 if 条件判断（官网也不建议用 if ），而是改用 location 的正则匹配：

```bash
location ~ ^/articles/.*(?<!\.html)$ {
    rewrite ^(.*)$ /$1.html last;
}
```

附： [Nginx 官方文档](https://nginx.org/en/docs/http/ngx_http_core_module.html)

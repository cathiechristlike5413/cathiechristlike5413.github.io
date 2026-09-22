---
title: "这个博客是怎样搭建的"
description: "用 Astro、Markdown 和 GitHub Pages，搭建一套免费、快速、完全属于自己的写作系统。"
pubDate: 2026-09-15
category: "技术"
tags: ["Astro", "博客搭建", "GitHub Pages"]
---

这个博客的目标很简单：打开快、维护轻、内容完全属于自己，而且不需要为服务器付费。

最终采用的是 **Astro + Markdown + GitHub Pages** 的组合。

## 为什么选择 Astro

Astro 默认生成静态 HTML。页面不需要在浏览器里加载庞大的应用框架，访问速度很快；内容以 Markdown 保存，不绑定任何在线平台。

它同时保留了组件化能力，像页头、页脚、文章卡片这些重复部分只维护一次即可。

## 文章是一份 Markdown 文件

每篇新文章只需要在 `src/content/blog` 中新建一个 `.md` 文件：

```md
---
title: "文章标题"
description: "用于列表和搜索引擎的摘要"
pubDate: 2026-09-22
category: "技术"
tags: ["Astro", "前端"]
featured: false
---

正文从这里开始。
```

写完并推送代码，GitHub Actions 会自动构建并发布，通常一两分钟后就能在网站上看到。

## 为什么使用 GitHub Pages

它会自动把仓库里的静态文件托管到公网，并提供 `https://username.github.io` 这样的免费地址。

工作流非常直接：

1. 本地修改和预览；
2. 提交到 Git；
3. 推送到 GitHub；
4. Actions 自动完成部署。

没有服务器需要维护，也不需要手动上传文件。

## 保持简单

一个个人博客不需要一开始就拥有所有功能。评论、统计、邮件订阅都可以在真正需要时再增加。

先让写作变得顺畅，再让系统逐步生长。

这套网站最终选择了页面搜索、标签、归档、RSS 和深色模式，但没有加入登录、数据库或复杂的后端。每一个功能都是为了让内容更容易被写下来、被找到和被阅读。

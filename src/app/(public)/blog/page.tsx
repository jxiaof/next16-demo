import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function BlogPage() {
  const categories = ["全部", "技术", "产品", "公告", "教程"];

  const featuredPost = {
    id: 0,
    title: "重磅更新：全新功能正式发布",
    desc: "我们很高兴地宣布，经过数月的开发和测试，全新版本正式上线。本次更新带来了众多新功能和性能优化...",
    date: "2025-12-18",
    category: "公告",
  };

  const posts = [
    {
      id: 1,
      title: "如何快速上手我们的产品",
      desc: "本文将详细介绍产品的核心功能和使用方法，帮助你快速入门。",
      date: "2025-12-18",
      category: "教程",
    },
    {
      id: 2,
      title: "2025 年技术趋势展望",
      desc: "探讨即将到来的技术变革，以及它们如何影响我们的产品方向。",
      date: "2025-12-17",
      category: "技术",
    },
    {
      id: 3,
      title: "客户成功案例分享",
      desc: "了解我们的客户是如何使用产品来解决实际业务问题的。",
      date: "2025-12-16",
      category: "产品",
    },
    {
      id: 4,
      title: "最佳实践指南",
      desc: "总结了使用产品时的最佳实践，助你提升工作效率。",
      date: "2025-12-15",
      category: "教程",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold md:text-3xl">Blog</h1>
        <p className="text-muted-foreground">最新文章与资讯</p>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input placeholder="搜索文章..." className="flex-1" />
          <Button variant="secondary">搜索</Button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={cat === "全部" ? "default" : "outline"}
              size="sm"
              className="shrink-0"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* 精选文章 */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* 图片占位 */}
          <div className="aspect-video bg-muted md:aspect-auto md:w-2/5" />
          {/* 内容 */}
          <CardHeader className="flex-1 justify-center">
            <div className="flex items-center gap-2">
              <span className="rounded bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                {featuredPost.category}
              </span>
              <time className="text-xs text-muted-foreground">
                {featuredPost.date}
              </time>
            </div>
            <CardTitle className="text-lg md:text-xl">
              {featuredPost.title}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {featuredPost.desc}
            </CardDescription>
            <div className="pt-2">
              <Button size="sm" asChild>
                <Link href={`/detail/${featuredPost.id}`}>阅读更多</Link>
              </Button>
            </div>
          </CardHeader>
        </div>
      </Card>

      {/* 文章列表 */}
      <div className="grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link key={post.id} href={`/detail/${post.id}`}>
            <Card className="h-full transition-colors hover:border-primary">
              {/* 图片占位 */}
              <div className="aspect-video bg-muted" />
              <CardHeader className="p-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded bg-muted px-1.5 py-0.5">
                    {post.category}
                  </span>
                  <time className="text-muted-foreground">{post.date}</time>
                </div>
                <CardTitle className="line-clamp-1 text-base">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {post.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* 分页 */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled>
          上一页
        </Button>
        <span className="px-2 text-sm text-muted-foreground">1 / 5</span>
        <Button variant="outline" size="sm">
          下一页
        </Button>
      </div>
    </div>
  );
}

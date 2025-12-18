import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  const features = [
    {
      icon: "🚀",
      title: "快速上手",
      desc: "简单易用的界面，快速开始你的项目",
    },
    {
      icon: "🔒",
      title: "安全可靠",
      desc: "企业级安全保障，数据加密存储",
    },
    {
      icon: "📊",
      title: "数据分析",
      desc: "强大的数据分析能力，助力决策",
    },
  ];

  const items = [
    { id: 1, title: "文章标题一", desc: "这是文章的简短描述信息" },
    { id: 2, title: "文章标题二", desc: "这是文章的简短描述信息" },
    { id: 3, title: "文章标题三", desc: "这是文章的简短描述信息" },
  ];

  return (
    <div className="space-y-12">
      {/* Hero 区域 */}
      <section className="flex flex-col items-center space-y-6 py-8 text-center md:py-12">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
          欢迎使用我们的产品
        </h1>
        <p className="max-w-2xl text-muted-foreground md:text-lg">
          一站式解决方案，助力您的业务增长。简单、高效、可靠。
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">立即开始</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/pricing">查看定价</Link>
          </Button>
        </div>
      </section>

      {/* 特性区域 */}
      <section className="space-y-6">
        <h2 className="text-center text-xl font-semibold md:text-2xl">
          核心特性
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="text-center">
              <CardHeader>
                <div className="mx-auto mb-2 text-3xl">{feature.icon}</div>
                <CardTitle className="text-base">{feature.title}</CardTitle>
                <CardDescription>{feature.desc}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* 最新内容 */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold md:text-2xl">最新内容</h2>
          <Link
            href="/blog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            查看更多 →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/detail/${item.id}`}>
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA 区域 */}
      <section className="rounded-lg bg-muted p-6 text-center md:p-10">
        <h2 className="text-xl font-semibold md:text-2xl">准备好开始了吗？</h2>
        <p className="mt-2 text-muted-foreground">
          立即注册，体验全部功能
        </p>
        <Button className="mt-4" size="lg" asChild>
          <Link href="/register">免费注册</Link>
        </Button>
      </section>
    </div>
  );
}

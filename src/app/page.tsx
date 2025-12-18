import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function Home() {
  const items = [
    { id: 1, title: "文章标题一", desc: "这是文章的简短描述信息" },
    { id: 2, title: "文章标题二", desc: "这是文章的简短描述信息" },
    { id: 3, title: "文章标题三", desc: "这是文章的简短描述信息" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">首页</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <Link key={item.id} href={`/detail/${item.id}`}>
            <Card className="h-full transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
              <CardHeader>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

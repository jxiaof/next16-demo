import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="sm">
            ← 返回首页
          </Button>
        </Link>
      </div>

      <article className="space-y-6">
        <h1 className="text-2xl font-bold">详情页 #{id}</h1>

        <Card>
          <CardHeader>
            <CardTitle>内容详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-zinc-600 dark:text-zinc-400">
              这是详情页的内容区域，ID 为 {id}。
            </p>
            <div className="flex gap-2">
              <Button>主要操作</Button>
              <Button variant="outline">次要操作</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>留言评论</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <Input placeholder="请输入您的留言..." />
              <Button type="submit" className="w-full sm:w-auto">
                提交
              </Button>
            </form>
          </CardContent>
        </Card>
      </article>
    </div>
  );
}

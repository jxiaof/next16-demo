import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MarketPage() {
  const categories = ["全部", "热门", "最新", "推荐"];

  const products = [
    { id: 1, name: "产品 A", price: "¥99", desc: "产品描述信息", tag: "热门" },
    { id: 2, name: "产品 B", price: "¥199", desc: "产品描述信息", tag: "新品" },
    { id: 3, name: "产品 C", price: "¥299", desc: "产品描述信息", tag: null },
    { id: 4, name: "产品 D", price: "¥399", desc: "产品描述信息", tag: "推荐" },
    { id: 5, name: "产品 E", price: "¥499", desc: "产品描述信息", tag: null },
    { id: 6, name: "产品 F", price: "¥599", desc: "产品描述信息", tag: "热门" },
  ];

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold md:text-3xl">Market</h1>
        <p className="text-muted-foreground">浏览所有产品</p>
      </div>

      {/* 搜索和筛选 - 移动端垂直布局 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full max-w-sm items-center gap-2">
          <Input placeholder="搜索产品..." className="flex-1" />
          <Button variant="secondary">搜索</Button>
        </div>
        {/* 分类标签 - 移动端可横向滚动 */}
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

      {/* 产品网格 - 响应式列数 */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            {/* 图片区域 */}
            <div className="relative aspect-square bg-muted">
              {product.tag && (
                <span className="absolute left-2 top-2 rounded bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                  {product.tag}
                </span>
              )}
            </div>
            <CardHeader className="p-3 pb-0">
              <CardTitle className="text-sm font-medium">
                {product.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground">{product.desc}</p>
            </CardHeader>
            <CardContent className="p-3 pt-2">
              <p className="text-base font-semibold">{product.price}</p>
            </CardContent>
            <CardFooter className="p-3 pt-0">
              <Button size="sm" className="w-full" asChild>
                <Link href={`/detail/${product.id}`}>查看详情</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* 加载更多 */}
      <div className="flex justify-center pt-4">
        <Button variant="outline">加载更多</Button>
      </div>
    </div>
  );
}

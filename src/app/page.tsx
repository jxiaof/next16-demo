import Link from "next/link";

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
          <Link
            key={item.id}
            href={`/detail/${item.id}`}
            className="block rounded-lg border p-4 transition-colors hover:border-primary"
          >
            <h2 className="font-medium">{item.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

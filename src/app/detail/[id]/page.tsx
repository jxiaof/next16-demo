import Link from "next/link";

interface DetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        ← 返回首页
      </Link>
      <article className="space-y-4">
        <h1 className="text-2xl font-bold">详情页 #{id}</h1>
        <p className="text-muted-foreground">
          这是详情页的内容区域，ID 为 {id}。
        </p>
        <div className="rounded-lg bg-muted p-4">
          <p className="text-sm">内容占位区域</p>
        </div>
      </article>
    </div>
  );
}

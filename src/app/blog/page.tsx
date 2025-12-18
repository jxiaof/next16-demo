import Link from "next/link";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "博客文章标题一",
      desc: "这是博客文章的简短描述，介绍文章的主要内容。",
      date: "2025-12-18",
    },
    {
      id: 2,
      title: "博客文章标题二",
      desc: "这是博客文章的简短描述，介绍文章的主要内容。",
      date: "2025-12-17",
    },
    {
      id: 3,
      title: "博客文章标题三",
      desc: "这是博客文章的简短描述，介绍文章的主要内容。",
      date: "2025-12-16",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Blog</h1>
        <p className="mt-1 text-muted-foreground">最新文章与资讯</p>
      </div>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/detail/${post.id}`}
            className="block rounded-lg border p-4 transition-colors hover:border-primary"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-medium">{post.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {post.desc}
                </p>
              </div>
              <time className="shrink-0 text-sm text-muted-foreground">
                {post.date}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

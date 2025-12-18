import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 移动端：垂直布局 / 桌面端：水平布局 */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* 品牌 */}
          <div className="space-y-2">
            <Link href="/" className="text-lg font-semibold">
              Logo
            </Link>
            <p className="text-sm text-muted-foreground">
              简短的产品描述信息
            </p>
          </div>

          {/* 链接 */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground">
              关于我们
            </Link>
            <Link href="/privacy" className="hover:text-foreground">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              服务条款
            </Link>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-6 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Your Company. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

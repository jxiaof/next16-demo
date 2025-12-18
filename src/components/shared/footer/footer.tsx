import Link from "next/link";
import { Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* 移动端：垂直布局 / 桌面端：水平布局 */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          {/* 品牌 */}
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
                C
              </div>
              Coconut
            </Link>
            <p className="max-w-xs text-sm text-muted-foreground">
              专业的企业级解决方案，助力您的业务增长。
            </p>
            {/* 社交链接 */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Github"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* 链接组 */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div className="space-y-3">
              <h4 className="text-sm font-medium">产品</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/market" className="hover:text-foreground">
                    市场
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-foreground">
                    定价
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">资源</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/blog" className="hover:text-foreground">
                    博客
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="hover:text-foreground">
                    文档
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-medium">公司</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/about" className="hover:text-foreground">
                    关于我们
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-foreground">
                    联系我们
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 版权信息 */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Coconut. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              隐私政策
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              服务条款
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

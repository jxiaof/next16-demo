"use client";

/**
 * 排版规范演示页面
 * 
 * 展示全部可用的排版级别、样式和最佳实践
 * 用于:
 * 1. 开发人员参考学习
 * 2. 设计系统验证
 * 3. 跨浏览器测试
 */

import { TypographyShowcase } from "@/components/shared";

export default function TypographyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 页面标题 */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <h1 className="text-3xl font-semibold leading-tight">
            排版规范文档
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            企业级字体渲染与排版规范的完整实现，包括字体族、字阶、行高、颜色对比度等规范。
          </p>
        </div>
      </div>

      {/* 快速导航 */}
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <div className="flex flex-wrap gap-2 text-xs font-medium">
            <a href="#typography" className="rounded px-3 py-1 hover:bg-secondary">
              排版级别
            </a>
            <a href="#colors" className="rounded px-3 py-1 hover:bg-secondary">
              颜色对比
            </a>
            <a href="#components" className="rounded px-3 py-1 hover:bg-secondary">
              组件示例
            </a>
            <a href="#reference" className="rounded px-3 py-1 hover:bg-secondary">
              参考表
            </a>
          </div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="mx-auto max-w-5xl">
        <TypographyShowcase />

        {/* 额外信息 */}
        <div className="space-y-12 border-t border-border px-4 py-12">
          {/* 实施建议 */}
          <section>
            <h2 className="text-2xl font-semibold leading-snug">
              实施建议
            </h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold">✅ 使用预定义类名</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  优先使用 Tailwind 工具类或预定义的排版类，确保全应用一致性。
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold">✅ 检查对比度</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  在深色模式下验证文字对比度，确保满足 WCAG AA 标准。
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold">✅ 跨平台测试</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  在 Mac、Windows、iOS、Android 下测试字体渲染效果。
                </p>
              </div>

              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-semibold">✅ 使用等宽字体</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  所有数值、代码、表单数据使用 font-mono 确保对齐。
                </p>
              </div>
            </div>
          </section>

          {/* 工具与资源 */}
          <section>
            <h2 className="text-2xl font-semibold leading-snug">
              开发工具与资源
            </h2>

            <div className="mt-6 space-y-2 text-sm">
              <div className="rounded-lg border border-border bg-secondary p-4">
                <p className="font-mono">
                  <strong>配置文件:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>• `src/lib/typography.ts` - 排版配置常量</li>
                  <li>• `src/lib/hooks/use-typography.ts` - React Hook</li>
                  <li>• `src/lib/utils.ts` - 工具函数</li>
                  <li>• `src/app/globals.css` - 全局排版优化</li>
                </ul>
              </div>

              <div className="rounded-lg border border-border bg-secondary p-4">
                <p className="font-mono">
                  <strong>使用方式:</strong>
                </p>
                <ul className="mt-2 space-y-1 text-muted-foreground">
                  <li>
                    • 方法 1: 直接使用 Tailwind 类
                    <code className="ml-2 text-xs">className="text-sm leading-relaxed"</code>
                  </li>
                  <li>
                    • 方法 2: 使用工具函数
                    <code className="ml-2 text-xs">typographyClass("body-normal")</code>
                  </li>
                  <li>
                    • 方法 3: 使用 Hook
                    <code className="ml-2 text-xs">const {"{"}body{"}"} = useTypography()</code>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 验证清单 */}
          <section className="rounded-lg border-l-4 border-primary bg-accent p-6">
            <h2 className="text-2xl font-semibold leading-snug">
              代码审查检查清单
            </h2>

            <ul className="mt-4 space-y-2 text-sm">
              <li>☐ 标题是否使用 `heading-1`, `heading-2`, `heading-3`?</li>
              <li>☐ 正文是否使用 `body-emphasis`, `body-normal`, `body-small`?</li>
              <li>☐ 是否避免使用 `font-bold` (用 `font-semibold` 替代)?</li>
              <li>☐ 数值/代码是否使用 `font-mono`?</li>
              <li>☐ 文本颜色是否来自 `text-foreground`, `text-muted-foreground`, `text-muted`?</li>
              <li>☐ 是否避免使用纯黑色 (#000) 或纯白色 (#fff)?</li>
              <li>☐ 深色模式下对比度是否检查过?</li>
              <li>☐ 在不同操作系统上是否测试过?</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

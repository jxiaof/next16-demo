/**
 * 排版规范示例组件
 * 
 * 演示如何正确应用企业级字体排版规范
 * 可用于:
 * 1. 开发人员参考学习
 * 2. 设计系统文档
 * 3. 代码审查检查清单
 */

import { useTypography } from "@/lib/hooks/use-typography";
import { TYPOGRAPHY_SCALE, COLOR_HIERARCHY, type TypographyScaleEntry, type ColorHierarchyEntry } from "@/lib/typography";

/**
 * 排版规范展示
 * 展示全部可用的排版级别和样式
 */
export function TypographyShowcase() {
  const { heading, body, monospace, contrast, preset } = useTypography();

  return (
    <div className="space-y-12 p-8">
      {/* ============================================
          1. 标题级别演示
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>1. 标题级别 (Heading Levels)</h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted">
              一级标题 (H1) - 32px, Weight 600, Line-height 1.2
            </label>
            <h1 className={heading("h1")}>
              这是一级标题，用于页面主题
            </h1>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted">
              二级标题 (H2) - 24px, Weight 600, Line-height 1.3
            </label>
            <h2 className={heading("h2")}>
              这是二级标题，用于模块标题
            </h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted">
              三级标题 (H3) - 20px, Weight 600, Line-height 1.4
            </label>
            <h3 className={heading("h3")}>
              这是三级标题，用于小组标题
            </h3>
          </div>
        </div>
      </section>

      {/* ============================================
          2. 正文级别演示
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>2. 正文级别 (Body Levels)</h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted">
              强调正文 - 16px, Weight 500, Line-height 1.5
            </label>
            <p className={body("emphasis")}>
              这是强调正文，用于卡片内容和列表标题。通常配合 font-medium 使用，以突出重要内容。
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted">
              标准正文 - 14px, Weight 400, Line-height 1.5
            </label>
            <p className={body("normal")}>
              这是标准正文，用于默认阅读文字。这是最常用的排版级别，应该成为你的首选。
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted">
              小号正文 - 12px, Weight 400, Line-height 1.4
            </label>
            <p className={body("small")}>
              这是小号正文，用于表单提示、页脚和标签。使用时需注意对比度，确保可读性。
            </p>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted">
              次要正文 (Secondary) - 带灰色文字
            </label>
            <p className={body("normal", true)}>
              这是带次要颜色的正文，使用 text-muted-foreground 呈现。适用于辅助描述。
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          3. 对比度级别演示
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>3. 对比度级别 (Color Hierarchy)</h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border border-border p-4">
            <p className={`${body("normal")} ${contrast("primary")}`}>
              🔴 <strong>一级文本 (Primary)</strong> - 最高对比度，用于标题和主要内容
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className={`${body("normal")} ${contrast("secondary")}`}>
              🟡 <strong>二级文本 (Secondary)</strong> - 中等对比度，用于次要信息
            </p>
          </div>

          <div className="rounded-lg border border-border p-4">
            <p className={`${body("normal")} ${contrast("tertiary")}`}>
              🟢 <strong>三级文本 (Tertiary)</strong> - 最低对比度，用于禁用/占位符
            </p>
          </div>
        </div>
      </section>

      {/* ============================================
          4. 等宽字体演示
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>4. 等宽字体 (Monospace)</h2>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted">
              代码段落 (Code)
            </label>
            <code className={`rounded bg-muted p-2 ${monospace("code")}`}>
              const greeting = &quot;Hello, Coconut!&quot;;
            </code>
          </div>

          <div>
            <label className="text-xs font-semibold text-muted">
              数值显示 (Numeric) - 使用 Tabular Numerals 确保对齐
            </label>
            <div className={monospace("numeric")}>
              <div>金额: ¥1,234,567.89</div>
              <div>计数: 1,234,567</div>
              <div>比例: 3.14159265</div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          5. 预设组合演示
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>5. 预设组合 (Presets)</h2>

        <div className="mt-6 space-y-4">
          <div className="rounded-lg border-2 border-primary bg-card p-6">
            <h1 className={preset("heroTitle")}>Hero Title</h1>
            <p className={preset("cardBody")}>这是一个完整的卡片预设示例</p>
          </div>

          <div className="rounded-lg border border-border bg-secondary p-4">
            <h3 className={preset("cardTitle")}>Card Title</h3>
            <p className={preset("cardBody")}>Card Body Text</p>
          </div>

          <form className="space-y-4 rounded-lg border border-border p-4">
            <div>
              <label className={preset("formLabel")} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                className="mt-2 w-full rounded border border-border px-3 py-2"
              />
              <p className={preset("formHelper")}>
                我们不会与任何人分享你的邮箱
              </p>
            </div>
            <button className={`rounded bg-primary px-4 py-2 text-primary-foreground ${preset("buttonText")}`}>
              Submit
            </button>
          </form>
        </div>
      </section>

      {/* ============================================
          6. 排版规范表格
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>6. 排版规范参考表</h2>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th className="px-4 py-2 text-left font-semibold">等级</th>
                <th className="px-4 py-2 text-left font-semibold">字号</th>
                <th className="px-4 py-2 text-left font-semibold">行高</th>
                <th className="px-4 py-2 text-left font-semibold">权重</th>
                <th className="px-4 py-2 text-left font-semibold">使用场景</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(TYPOGRAPHY_SCALE).map(([key, value]) => {
                const entry = value as TypographyScaleEntry;
                return (
                  <tr key={key} className="border-b border-border hover:bg-secondary">
                    <td className="px-4 py-2 font-semibold">{entry.cssClass}</td>
                    <td className="px-4 py-2">{entry.fontSize}</td>
                    <td className="px-4 py-2">{entry.lineHeight}</td>
                    <td className="px-4 py-2">{entry.fontWeight}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">
                      {entry.description}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================
          7. 颜色对比度参考
          ============================================ */}
      <section>
        <h2 className={heading("h2")}>7. 颜色对比度参考</h2>

        <div className="mt-6 space-y-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-border bg-muted">
                <th className="px-4 py-2 text-left font-semibold">级别</th>
                <th className="px-4 py-2 text-left font-semibold">亮色模式</th>
                <th className="px-4 py-2 text-left font-semibold">暗色模式</th>
                <th className="px-4 py-2 text-left font-semibold">使用场景</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(COLOR_HIERARCHY).map(([key, value]) => {
                const entry = value as ColorHierarchyEntry;
                return (
                  <tr key={key} className="border-b border-border">
                    <td className="px-4 py-2 font-semibold">{key}</td>
                    <td className="px-4 py-2 font-mono text-xs">{entry.light}</td>
                    <td className="px-4 py-2 font-mono text-xs">{entry.dark}</td>
                    <td className="px-4 py-2 text-sm text-muted-foreground">
                      {entry.usage}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ============================================
          8. 最佳实践建议
          ============================================ */}
      <section className="rounded-lg border-l-4 border-primary bg-accent p-6">
        <h2 className={heading("h2")}>8. 最佳实践 & 检查清单</h2>

        <ul className={`${body("normal")} mt-4 space-y-2`}>
          <li>✅ 使用预定义的排版类而不是手写样式</li>
          <li>✅ 中文文本避免使用 font-bold (700)，改用 font-semibold (600)</li>
          <li>✅ 所有数值/代码使用 font-mono 确保对齐</li>
          <li>✅ 行高严格按照表格执行，不使用浏览器默认值</li>
          <li>✅ 避免使用纯黑色 (#000)，使用 text-foreground 替代</li>
          <li>✅ 在 Mac 和 Windows 下都测试过字体渲染</li>
          <li>✅ 深色模式下检查对比度是否满足 WCAG AA 标准</li>
        </ul>
      </section>
    </div>
  );
}

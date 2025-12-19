# 企业级排版规范实施指南

## 📋 快速开始

### 在 React 组件中应用排版

#### 方法 1: 使用 Tailwind 工具类 (推荐简单场景)

```tsx
export function ArticleCard() {
  return (
    <div className="rounded-lg bg-card p-6">
      <h3 className="text-xl font-semibold">文章标题</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        文章摘要...
      </p>
    </div>
  )
}
```

#### 方法 2: 使用工具函数 (推荐中等复杂度)

```tsx
import { typographyClass } from "@/lib/utils"

export function ArticleCard() {
  return (
    <div className="rounded-lg bg-card p-6">
      <h3 className={typographyClass("heading-3")}>文章标题</h3>
      <p className={typographyClass("body-normal", "text-muted-foreground")}>
        文章摘要...
      </p>
    </div>
  )
}
```

#### 方法 3: 使用 Typography Hook (推荐复杂场景)

```tsx
import { useTypography } from "@/lib/hooks/use-typography"

export function ArticleCard() {
  const { heading, body, contrast } = useTypography()
  
  return (
    <div className="rounded-lg bg-card p-6">
      <h3 className={heading("h3")}>文章标题</h3>
      <p className={`${body("normal")} ${contrast("secondary")}`}>
        文章摘要...
      </p>
    </div>
  )
}
```

#### 方法 4: 使用预设 (推荐常见场景)

```tsx
import { useTypography } from "@/lib/hooks/use-typography"

export function FormField() {
  const { preset } = useTypography()
  
  return (
    <div>
      <label className={preset("formLabel")}>Email</label>
      <input type="email" />
      <p className={preset("formHelper")}>输入你的邮箱地址</p>
    </div>
  )
}
```

---

## 🎯 常见应用场景

### 场景 1: 页面标题区块

```tsx
<div>
  <h1 className="text-3xl font-semibold leading-tight">
    页面主标题
  </h1>
  <p className="text-sm leading-relaxed text-muted-foreground mt-2">
    页面描述或副标题
  </p>
</div>
```

### 场景 2: 卡片组件

```tsx
<div className="rounded-lg bg-card border border-border p-6">
  {/* 卡片标题 */}
  <h3 className="text-xl font-semibold">卡片标题</h3>
  
  {/* 卡片正文 */}
  <p className="text-sm leading-relaxed text-muted-foreground mt-2">
    这是卡片的正文内容。描述卡片的主要信息。
  </p>
  
  {/* 卡片底部操作 */}
  <button className="mt-4 text-base font-medium">
    了解更多
  </button>
</div>
```

### 场景 3: 表单字段

```tsx
<div className="space-y-2">
  {/* 标签 */}
  <label className="text-base font-semibold">
    用户名
  </label>
  
  {/* 输入框 */}
  <input 
    type="text"
    placeholder="输入用户名"
    className="w-full rounded border border-border px-3 py-2"
  />
  
  {/* 帮助文字 */}
  <p className="text-xs leading-normal text-muted">
    用户名必须为 3-20 个字符
  </p>
</div>
```

### 场景 4: 列表/表格

```tsx
<table className="w-full">
  <thead>
    <tr className="border-b-2 border-border">
      <th className="px-4 py-2 text-left text-base font-semibold">
        列名
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-border">
      <td className="px-4 py-2 text-sm leading-relaxed">
        表格数据
      </td>
    </tr>
  </tbody>
</table>
```

### 场景 5: 数值显示 (金额、计数等)

```tsx
{/* 使用 font-mono 和 tabular-nums 确保对齐 */}
<div className="font-mono tabular-nums">
  <div>金额: ¥1,234,567.89</div>
  <div>计数:  1,234,567</div>
  <div>比率:     3.14%</div>
</div>
```

### 场景 6: 代码块

```tsx
<pre className="overflow-x-auto rounded-lg bg-muted p-4">
  <code className="font-mono text-sm leading-relaxed">
    {`const greeting = "Hello, World!";`}
  </code>
</pre>
```

---

## 🎨 颜色与对比度

### 文本颜色三级层级

```tsx
{/* 一级文本 - 标题/主要内容 */}
<p className="text-foreground">一级文本</p>

{/* 二级文本 - 次要信息/描述 */}
<p className="text-muted-foreground">二级文本</p>

{/* 三级文本 - 禁用/占位符 */}
<p className="text-muted">三级文本</p>
```

### 检查对比度

深色模式下，确保满足 WCAG AA 标准 (最小对比度 4.5:1):

- ✅ `text-foreground` on `bg-background` - 通过 ✓
- ✅ `text-muted-foreground` on `bg-background` - 通过 ✓  
- ⚠️ `text-muted` on `bg-background` - 谨慎使用，仅用于禁用状态

---

## 📱 移动设备适配

### 响应式字体大小

虽然不推荐动态改变字体大小，但在极端场景下可使用:

```tsx
<h1 className="text-2xl sm:text-3xl font-semibold leading-tight">
  响应式标题
</h1>
```

### 禁用自动缩放

所有排版已在 `body` 标签中设置 `-webkit-text-size-adjust: 100%;`，禁用移动端横屏自动放大。

---

## 🔍 调试与验证

### 验证字体应用

在浏览器开发者工具中检查:

1. **开启检查工具** (F12)
2. **右键元素 > 检查**
3. **在 Computed 标签查看:**
   - `font-family` - 确保是正确的字体
   - `font-size` - 确保是正确的大小
   - `line-height` - 确保是正确的行高
   - `-webkit-font-smoothing` - 应为 `antialiased`

### 跨浏览器测试

在以下平台验证字体渲染:

- ✅ Chrome/Edge (Windows)
- ✅ Chrome (macOS)
- ✅ Safari (macOS)
- ✅ Safari (iOS)
- ✅ Chrome (Android)

### 使用排版展示组件

访问 `/typography-showcase` 页面查看所有排版级别的实际效果:

```tsx
import { TypographyShowcase } from "@/components/shared"

export default function ShowcasePage() {
  return <TypographyShowcase />
}
```

---

## 🚀 性能最佳实践

### ✅ DO (推荐)

- ✅ 使用系统字体，避免外部字体加载
- ✅ 使用 Tailwind 工具类 (`text-sm`, `font-semibold` 等)
- ✅ 在 `body` 上应用全局优化 (已完成)
- ✅ 使用 `font-mono` 显示数值和代码
- ✅ 采用 3 级颜色层级，避免过多颜色

### ❌ DON'T (避免)

- ❌ 使用 `style` 属性直接定义字体大小
- ❌ 使用纯黑色 (#000) 或纯白色 (#fff)
- ❌ 使用 `font-weight: 700` 在中文环境 (改用 600)
- ❌ 在行内 HTML 中定义 `style="line-height: xxx"`
- ❌ 混用多个外部字体，增加加载时间

---

## 📚 核心配置文件

### 1. `src/app/globals.css`
- 全局排版优化 (`-webkit-font-smoothing`, `text-rendering` 等)
- 排版工具类 (`.heading-1`, `.body-normal` 等)

### 2. `src/lib/typography.ts`
- `FONT_FAMILY` - 字体族定义
- `TYPOGRAPHY_SCALE` - 字阶参考表
- `COLOR_HIERARCHY` - 颜色对比度规范
- `TYPOGRAPHY_PRESETS` - 预设组合

### 3. `src/lib/hooks/use-typography.ts`
- `useTypography()` - React Hook
- `typographyUtils` - 函数式工具

### 4. `src/lib/utils.ts`
- `typographyClass()` - 类名生成器
- `getTextColorClass()` - 颜色类获取

---

## 🔗 相关资源

- [Tailwind CSS Typography](https://tailwindcss.com/docs/font-size)
- [WCAG 颜色对比度检查器](https://webaim.org/resources/contrastchecker/)
- [Font Smoothing 指南](https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-font-smoothing)
- [中文排版最佳实践](https://zhuanlan.zhihu.com/p/20506092)

---

## 🎓 学习资源

### 中文排版基础

中文排版有独特的挑战:
- **字重**: 中文 600 比 700 更美观 (避免发虚)
- **行高**: 推荐 1.2-1.5 (比英文更紧凑)
- **字号**: 使用 4px 倍数确保节奏感
- **空格**: 中文不需要单词间距

### 企业级排版示例

参考世界顶级公司的排版规范:
- [Apple - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines)
- [Google - Material Design Typography](https://material.io/design/typography)
- [Microsoft - Fluent Design System](https://www.microsoft.com/design/fluent)

---

## ❓ FAQ

**Q: 为什么使用 600 权重而不是 700?**
A: 在中文环境中，font-weight: 700 会让文字显得模糊发虚。600 是最佳平衡。

**Q: 能否自定义字体大小?**
A: 非常不推荐。除非有特殊业务需求，应严格遵循 `TYPOGRAPHY_SCALE` 表格。

**Q: 移动端字体显示模糊怎么办?**
A: 已通过 `text-rendering: optimizeLegibility` 和 `-webkit-font-smoothing: antialiased` 优化。如仍有问题，检查是否使用了 `transform: scale()`。

**Q: 深色模式下文字看不清?**
A: 检查是否使用了 `text-muted` 或 `text-muted-foreground`。这些颜色在深色模式下对比度可能不足。

---

更新时间: 2025-12-19

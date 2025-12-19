# 排版规范 - 快速参考卡片

> 打印这个卡片，贴在你的显示器上！📌

## 🎨 字体族

| 用途 | 主要字体 | 回退 |
|------|---------|------|
| **标题/正文** | SF Pro, PingFang SC, Segoe UI | Roboto, Arial |
| **代码/数值** | SF Mono, Monaco, Consolas | Liberation Mono |

## 📏 字阶规范 (记住这 6 个！)

```
H1  → text-3xl font-semibold leading-tight       (32px)
H2  → text-2xl font-semibold leading-snug        (24px)
H3  → text-xl  font-semibold                     (20px)
BE  → text-base font-medium leading-relaxed      (16px)
BN  → text-sm  font-normal leading-relaxed       (14px)
BS  → text-xs  font-normal leading-normal        (12px)
```

💡 **中文用 600 (font-semibold)，不用 700 (font-bold)**

## 🎯 颜色三级层级

```
一级 → text-foreground           (标题、正文)
二级 → text-muted-foreground     (描述、次要)
三级 → text-muted                (禁用、占位符)
```

## ⚡ 常用组合

| 场景 | 类名组合 |
|------|----------|
| 页面标题 | `text-3xl font-semibold text-foreground` |
| 卡片标题 | `text-xl font-semibold text-foreground` |
| 卡片正文 | `text-sm leading-relaxed text-muted-foreground` |
| 表单标签 | `text-base font-semibold text-foreground` |
| 表单提示 | `text-xs text-muted` |
| 按钮文字 | `text-base font-medium` |
| 链接文字 | `text-sm underline` |
| 数值显示 | `font-mono font-medium` |
| 代码块 | `font-mono text-sm` |

## 🚀 使用方式

### 最简单 ✨
```tsx
<h2 className="text-2xl font-semibold">标题</h2>
```

### 简洁 🔧
```tsx
import { typographyClass } from "@/lib/utils"
<h2 className={typographyClass("heading-2")}>标题</h2>
```

### 灵活 ⚙️
```tsx
import { useTypography } from "@/lib/hooks/use-typography"
const { heading } = useTypography()
<h2 className={heading("h2")}>标题</h2>
```

### 最快 🎯
```tsx
const { preset } = useTypography()
<button className={preset("buttonText")}>按钮</button>
```

## ❌ 不要这样做

```tsx
❌ <p style="font-size: 14px">不要用 inline style</p>
❌ <h2 className="font-bold">不要用 font-bold (700)</h2>
❌ <p style="color: #000">不要用纯黑色</p>
❌ <span className="text-xxl">没有 text-xxl 这个类</span>
```

## ✅ 要这样做

```tsx
✅ <p className="text-sm">正确的 Tailwind 类</p>
✅ <h2 className="font-semibold">中文用 600 权重</h2>
✅ <p className="text-foreground">使用 Tailwind 颜色</p>
✅ <span className="text-xl">使用预定义大小</span>
```

## 📚 快速链接

- 📖 [完整指南](./TYPOGRAPHY_GUIDE.md)
- 📋 [规范参考](./PROJECT_GUIDELINES.md)
- 🎪 [演示页面](http://localhost:3000/typography)
- 💻 [配置文件](./src/lib/typography.ts)

---

**记住**: 使用预定义类而不是手写样式！一致性 = 专业性 ✨

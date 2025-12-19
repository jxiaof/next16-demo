/**
 * 企业级排版规范配置
 * 
 * 本模块定义了整个项目的字体、文字大小、行高等排版参数。
 * 确保全应用的排版一致性和可维护性。
 * 
 * 原则:
 * 1. 系统优先 - 优先使用系统原生字体
 * 2. 无级差排版 - 采用 4px 基数倍数的字阶系统
 * 3. 可读性第一 - 中文环境特殊优化
 * 4. 性能优化 - 避免外部字体加载延迟
 */

/**
 * 字体族定义 (Font Family Stack)
 * 采用分层回退机制，从左到右依次尝试
 */
export const FONT_FAMILY = {
  // 无衬线字体 - 用于标题、正文、UI 元素
  // 优先级: 系统字体 > 中文 > 英文
  sans: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Simplified Chinese", sans-serif`,

  // 等宽字体 - 用于代码、表单数据、数值
  // 优先级: 代码编辑器字体 > 系统等宽 > 备选
  mono: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
} as const;

/**
 * 字阶系统 (Typography Scale)
 * 基于 4px 基数的倍数关系，确保视觉节奏严谨
 */
export const TYPOGRAPHY_SCALE = {
  // 一级标题 - 页面主标题
  h1: {
    fontSize: "32px", // 8 * 4px
    lineHeight: 1.2, // 38.4px
    fontWeight: 600,
    cssClass: "heading-1",
    tailwind: "text-3xl font-semibold leading-tight",
    description: "页面大标题、卡片主题",
  },

  // 二级标题 - 模块/组件标题
  h2: {
    fontSize: "24px", // 6 * 4px
    lineHeight: 1.3, // 31.2px
    fontWeight: 600,
    cssClass: "heading-2",
    tailwind: "text-2xl font-semibold leading-snug",
    description: "模块标题、对话框标题",
  },

  // 三级标题 - 小组标题
  h3: {
    fontSize: "20px", // 5 * 4px
    lineHeight: 1.4, // 28px
    fontWeight: 600,
    cssClass: "heading-3",
    tailwind: "text-xl font-semibold",
    description: "小组标题、表单标签",
  },

  // 强调正文 - 卡片内容、列表标题
  bodyEmphasis: {
    fontSize: "16px", // 4 * 4px
    lineHeight: 1.5, // 24px (1.5 * 16)
    fontWeight: 500,
    cssClass: "body-emphasis",
    tailwind: "text-base font-medium leading-relaxed",
    description: "卡片内容、列表标题、按钮文字",
  },

  // 标准正文 - 默认阅读文字
  bodyNormal: {
    fontSize: "14px", // 3.5 * 4px
    lineHeight: 1.5, // 21px (1.5 * 14)
    fontWeight: 400,
    cssClass: "body-normal",
    tailwind: "text-sm leading-relaxed",
    description: "默认文本、正文段落",
  },

  // 辅助文字 - 表单提示、页脚、标签
  bodySmall: {
    fontSize: "12px", // 3 * 4px
    lineHeight: 1.4, // 16.8px
    fontWeight: 400,
    cssClass: "body-small",
    tailwind: "text-xs leading-normal",
    description: "表单提示文字、页脚、标签、徽章",
  },
} as const;

/**
 * 颜色与对比度规范 (Color & Contrast)
 * 避免使用纯黑色，采用灰度梯队减轻视觉疲劳
 */
export const COLOR_HIERARCHY = {
  // 一级文本 - 标题、正文等主要内容
  primary: {
    light: "rgba(0, 0, 0, 0.88)", // #1D1D1F
    dark: "rgba(255, 255, 255, 0.92)",
    tailwind: "text-foreground",
    usage: "标题、正文、关键内容",
  },

  // 二级文本 - 次要信息、描述
  secondary: {
    light: "rgba(0, 0, 0, 0.65)", // #424245
    dark: "rgba(255, 255, 255, 0.65)",
    tailwind: "text-muted-foreground",
    usage: "副标题、描述文字、帮助文本",
  },

  // 三级文本 - 禁用、占位符、边界
  tertiary: {
    light: "rgba(0, 0, 0, 0.45)", // #86868B
    dark: "rgba(255, 255, 255, 0.45)",
    tailwind: "text-muted",
    usage: "禁用状态、占位符、额外提示",
  },
} as const;

/**
 * 字体渲染优化配置
 * 用于 CSS 中的 body 元素
 */
export const RENDERING_OPTIMIZATION = {
  // Mac 系统字体抗锯齿
  webkitFontSmoothing: "antialiased",

  // Firefox 的 macOS 优化
  mozOsxFontSmoothing: "grayscale",

  // 文本渲染优化 - 改善中文显示
  textRendering: "optimizeLegibility",

  // 禁用移动设备横屏时的自动放大
  webkitTextSizeAdjust: "100%",

  // OpenType 特性优化
  fontFeatureSettings: '"rlig" 1, "calt" 1',
} as const;

/**
 * 排版规范检查清单
 * 用于代码审查和质量保证
 */
export const TYPOGRAPHY_CHECKLIST = [
  "✅ Mac 与 Windows 下字体粗细是否一致？",
  "✅ 行高是否严格按照表格执行？",
  "✅ 所有数值/代码是否使用 font-mono？",
  "✅ 链接/按钮点击态是否保持字体颜色一致？",
  "✅ 移动端是否测试过字体缩放？",
  "✅ 深色模式下文字对比度是否满足 WCAG AA 标准？",
  "✅ 是否避免使用纯黑色 (#000)？",
] as const;

/**
 * 常用排版组合 - 快速应用
 * 使用方式: className={TYPOGRAPHY_PRESETS.heroTitle}
 */
export const TYPOGRAPHY_PRESETS = {
  // 页面标题
  heroTitle: "heading-1 text-emphasis",

  // 卡片标题
  cardTitle: "heading-3 text-emphasis",

  // 卡片正文
  cardBody: "body-normal text-secondary",

  // 表单标签
  formLabel: "heading-3 font-semibold",

  // 表单帮助文字
  formHelper: "body-small text-tertiary",

  // 按钮文字
  buttonText: "body-emphasis font-medium",

  // 链接文字
  linkText: "body-normal underline",

  // 代码段落
  codeBlock: "font-code text-sm leading-relaxed",

  // 数值显示 (金额、计数等)
  numericValue: "font-numeric body-emphasis",
} as const;

/**
 * 调试辅助 - 打印当前排版配置
 * 仅在开发环境使用
 */
export function debugTypography() {
  if (process.env.NODE_ENV === "development") {
    console.group("📝 Typography Configuration");
    console.table(TYPOGRAPHY_SCALE);
    console.table(COLOR_HIERARCHY);
    console.table(RENDERING_OPTIMIZATION);
    console.groupEnd();
  }
}

/**
 * Typography Hook
 * 
 * 提供类型安全的排版类名生成，简化组件开发中的排版应用。
 * 确保全应用排版一致性。
 * 
 * 使用示例:
 * ```tsx
 * import { useTypography } from "@/lib/hooks/use-typography";
 * 
 * export function CardTitle() {
 *   const { heading } = useTypography();
 *   return <h2 className={heading("h2")}>Card Title</h2>;
 * }
 * ```
 */

type HeadingLevel = "h1" | "h2" | "h3";
type BodyLevel = "emphasis" | "normal" | "small";

/**
 * 排版 Hook
 * 提供类型安全的排版工具函数
 */
export function useTypography() {
  /**
   * 获取标题样式类名
   * @param level - 标题级别: h1, h2, h3
   * @param emphasis - 是否加强 (使用 font-semibold)
   */
  const heading = (level: HeadingLevel, emphasis = false) => {
    const baseClasses: Record<HeadingLevel, string> = {
      h1: "text-3xl leading-tight",
      h2: "text-2xl leading-snug",
      h3: "text-xl",
    };

    const fontWeight = emphasis ? "font-bold" : "font-semibold";
    return `${baseClasses[level]} ${fontWeight}`;
  };

  /**
   * 获取正文样式类名
   * @param level - 正文级别: emphasis, normal, small
   * @param secondary - 是否使用次要颜色
   */
  const body = (level: BodyLevel = "normal", secondary = false) => {
    const baseClasses: Record<BodyLevel, string> = {
      emphasis: "text-base font-medium leading-relaxed",
      normal: "text-sm leading-relaxed",
      small: "text-xs leading-normal",
    };

    const color = secondary ? "text-muted-foreground" : "text-foreground";
    return `${baseClasses[level]} ${color}`;
  };

  /**
   * 获取代码/数值样式类名
   * @param variant - 变体: code (代码段落) | numeric (数值)
   */
  const monospace = (variant: "code" | "numeric" = "code") => {
    const baseClass = "font-mono";
    const variantClass = variant === "numeric" ? "tabular-nums" : "";
    return `${baseClass} ${variantClass}`.trim();
  };

  /**
   * 获取对比度优化的文本样式
   * @param level - 对比度级别: primary (一级) | secondary (二级) | tertiary (三级)
   */
  const contrast = (level: "primary" | "secondary" | "tertiary" = "primary") => {
    const classes: Record<string, string> = {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      tertiary: "text-muted",
    };
    return classes[level];
  };

  /**
   * 为标题添加强调
   * 用于需要特别突出的标题
   */
  const emphasize = (className: string) => {
    return `${className} font-semibold tracking-tight`;
  };

  /**
   * 组合多个排版工具
   * @param preset - 预设名称
   */
  const preset = (
    preset:
      | "heroTitle"
      | "cardTitle"
      | "cardBody"
      | "formLabel"
      | "formHelper"
      | "buttonText"
      | "linkText"
      | "codeBlock"
      | "numericValue"
  ) => {
    const presets: Record<string, string> = {
      heroTitle: "text-3xl font-semibold leading-tight text-foreground",
      cardTitle: "text-xl font-semibold text-foreground",
      cardBody: "text-sm leading-relaxed text-muted-foreground",
      formLabel: "text-base font-semibold text-foreground",
      formHelper: "text-xs leading-normal text-muted",
      buttonText: "text-base font-medium text-foreground",
      linkText: "text-sm underline hover:no-underline",
      codeBlock: "font-mono text-sm leading-relaxed",
      numericValue: "font-mono font-medium text-base",
    };

    return presets[preset] || "";
  };

  return {
    heading,
    body,
    monospace,
    contrast,
    emphasize,
    preset,
  };
}

/**
 * 导出所有工具供函数式使用
 */
export const typographyUtils = {
  heading: (level: HeadingLevel, emphasis = false) => {
    const baseClasses: Record<HeadingLevel, string> = {
      h1: "text-3xl leading-tight",
      h2: "text-2xl leading-snug",
      h3: "text-xl",
    };
    const fontWeight = emphasis ? "font-bold" : "font-semibold";
    return `${baseClasses[level]} ${fontWeight}`;
  },

  body: (level: BodyLevel = "normal", secondary = false) => {
    const baseClasses: Record<BodyLevel, string> = {
      emphasis: "text-base font-medium leading-relaxed",
      normal: "text-sm leading-relaxed",
      small: "text-xs leading-normal",
    };
    const color = secondary ? "text-muted-foreground" : "text-foreground";
    return `${baseClasses[level]} ${color}`;
  },

  monospace: (variant: "code" | "numeric" = "code") => {
    const baseClass = "font-mono";
    const variantClass = variant === "numeric" ? "tabular-nums" : "";
    return `${baseClass} ${variantClass}`.trim();
  },

  contrast: (level: "primary" | "secondary" | "tertiary" = "primary") => {
    const classes: Record<string, string> = {
      primary: "text-foreground",
      secondary: "text-muted-foreground",
      tertiary: "text-muted",
    };
    return classes[level];
  },
};

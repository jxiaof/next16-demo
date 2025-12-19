import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * 合并 Tailwind 类名的工具函数
 * 确保类名冲突时，较后的类名优先级更高
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 排版类名生成器
 * 简化组件中排版类名的使用
 * 
 * 使用示例:
 * ```tsx
 * <h2 className={typographyClass("heading-2")}>标题</h2>
 * <p className={typographyClass("body-normal", "text-secondary")}>正文</p>
 * ```
 */
export function typographyClass(
  level: 
    | "heading-1" 
    | "heading-2" 
    | "heading-3" 
    | "body-emphasis" 
    | "body-normal" 
    | "body-small"
    | "font-numeric"
    | "font-code",
  ...additional: ClassValue[]
): string {
  const baseClasses: Record<string, string> = {
    "heading-1": "text-3xl font-semibold leading-tight",
    "heading-2": "text-2xl font-semibold leading-snug",
    "heading-3": "text-xl font-semibold",
    "body-emphasis": "text-base font-medium leading-relaxed",
    "body-normal": "text-sm leading-relaxed",
    "body-small": "text-xs leading-normal",
    "font-numeric": "font-mono tabular-nums",
    "font-code": "font-mono",
  }

  return cn(baseClasses[level], ...additional)
}

/**
 * 获取合适的文本颜色类
 * 确保文本对比度满足无障碍标准
 */
export function getTextColorClass(
  level: "primary" | "secondary" | "tertiary" = "primary"
): string {
  const colorMap = {
    primary: "text-foreground",
    secondary: "text-muted-foreground",
    tertiary: "text-muted",
  }
  return colorMap[level]
}

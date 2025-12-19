# 项目开发规范与架构指南

本项目采用 **Feature-First (功能优先)** 的架构模式，旨在确保代码在业务增长时保持高内聚、低耦合。

## 1. 目录结构规范

### `src/app` (路由层)
- **职责**: 定义路由、布局 (Layout)、元数据 (Metadata) 和服务端数据获取。
- **规范**: 页面组件应保持“薄”，主要负责组合 `features` 中的业务组件。避免在页面文件中直接定义复杂的表单或业务逻辑。

### `src/features` (业务功能层)
- **职责**: 包含特定业务领域的所有逻辑。
- **内部结构**:
  - `actions/`: Server Actions，负责处理表单提交和业务逻辑。
  - `components/`: 该功能特有的 UI 组件。
  - `hooks/`: (可选) 该功能特有的 React Hooks。
  - `schemas.ts`: Zod 校验模式。
  - `types.ts`: TypeScript 类型定义。
  - `index.ts`: 公共 API 导出文件。**外部模块只能通过 index.ts 导入该 feature 的内容。**

### `src/components` (通用组件层)
- `ui/`: 基础原子组件 (如 Button, Input)，通常由 shadcn/ui 生成。
- `shared/`: 跨业务功能的通用组件 (如 Navbar, Footer, ThemeToggle)。

### `src/lib` (基础设施层)
- `db/`: 数据库配置、Schema 定义。
- `db/dao/`: Data Access Objects，封装底层的数据库 CRUD 操作。
- `services/`: 复杂的跨模块业务逻辑。
- `utils.ts`: 通用工具函数。

## 2. 开发原则

1.  **单向依赖**: `features` 之间应尽量减少直接依赖。如果多个 feature 需要共享逻辑，考虑将其提取到 `lib` 或 `components/shared`。
2.  **DAO 封装**: 不要直接在 Server Actions 中调用 Drizzle 的 `db.select()` 等方法，应通过 `lib/db/dao` 进行封装，便于测试和复用。
3.  **Server Actions**: 所有的表单提交和状态变更应使用 Server Actions。
4.  **类型安全**: 充分利用 TypeScript 和 Zod，确保从数据库到 UI 的全链路类型安全。
5.  **导出规范**: 始终使用 `index.ts` 导出 feature 的公共接口，避免深层导入（如 `import { ... } from "@/features/auth/actions/login"`）。

## 3. 命名约定

-   **组件**: 大驼峰 (PascalCase)，如 `LoginForm.tsx`。
-   **文件/文件夹**: 小写横杠 (kebab-case)，如 `update-profile.ts`。
-   **Actions**: 以 `Action` 结尾，如 `loginAction`。
-   **DAO**: 以 `dao` 结尾，如 `usersDao`。

## 4. 字体与排版规范

### 4.1 字体族配置 (Font Family)

采用分层回退机制，优先使用系统原生字体，避免外部字体加载带来的性能问题。

**无衬线字体 (Sans-serif) - 用于标题、正文、UI 元素**
- **iOS/macOS**: San Francisco, PingFang SC
- **Windows**: Segoe UI, Microsoft YaHei  
- **Android**: Roboto, Noto Sans CJK SC
- **回退链**: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Simplified Chinese", sans-serif`

**等宽字体 (Monospace) - 用于代码、表单数据、数值**
- 回退链: `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`

### 4.2 字体渲染优化 (Rendering)

在 `body` 标签中应用以下 CSS 优化，修复不同浏览器下的字体粗细不均和锯齿问题：

```css
body {
  -webkit-font-smoothing: antialiased;  /* Mac 系统平滑 */
  -moz-osx-font-smoothing: grayscale;   /* Firefox 平滑 */
  text-rendering: optimizeLegibility;   /* 文本微调 */
  -webkit-text-size-adjust: 100%;       /* 禁用移动端自动放大 */
}
```

### 4.3 字阶与行高规范 (Typography Scale)

采用 4px 为基数的倍数关系，确保视觉节奏严谨。所有样式通过 Tailwind CSS 工具类应用。

| 等级 | 字号 | 行高 | 权重 | Tailwind 类 | 使用场景 |
|-----|------|------|------|------------|----------|
| **一级标题** | 32px | 1.2 | 600 | `text-3xl font-semibold leading-tight` | 页面主标题 |
| **二级标题** | 24px | 1.3 | 600 | `text-2xl font-semibold leading-snug` | 模块标题 |
| **三级标题** | 20px | 1.4 | 600 | `text-xl font-semibold` | 小组标题 |
| **强调正文** | 16px | 1.5 | 500 | `text-base font-medium leading-relaxed` | 卡片内容 |
| **标准正文** | 14px | 1.5 | 400 | `text-sm leading-relaxed` | 默认文本 |
| **辅助文字** | 12px | 1.4 | 400 | `text-xs leading-normal` | 表单提示、页脚 |

**重要 🔴**: 中文环境建议使用 `font-semibold (600)` 而非 `font-bold (700)`，以防文字发虚。

### 4.4 颜色与对比度 (Color & Contrast)

严禁使用纯黑色，采用灰度梯队以减轻视觉疲劳：

- **一级文本** (标题/正文): `text-foreground` - `rgba(0, 0, 0, 0.88)` (亮色) / `rgba(255, 255, 255, 0.92)` (暗色)
- **二级文本** (次要信息): `text-muted-foreground` - `rgba(0, 0, 0, 0.65)` (亮色) / `rgba(255, 255, 255, 0.65)` (暗色)  
- **三级文本** (禁用/占位符): `text-muted` - 更淡的灰度

### 4.5 性能与加载 (Performance)

- ✅ 优先使用系统字体，避免外部 WebFont 加载延迟
- ✅ 若必须使用自定义字体，仅允许 `.woff2` 格式
- ✅ 添加 `font-display: swap;` 避免 FOIT (文字闪烁)
- ✅ 中文字体必须子集化，体积 ≤ 200KB
- ✅ 推荐使用 Google Fonts 或 Alibaba 免费方案


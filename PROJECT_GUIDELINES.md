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

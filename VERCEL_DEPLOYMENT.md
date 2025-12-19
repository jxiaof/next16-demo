# Vercel 部署指南

## 快速部署

### 1. 连接 Git 仓库
在 Vercel 中导入你的 GitHub/GitLab 仓库：
- 登录 [Vercel](https://vercel.com)
- 点击 "New Project"
- 选择你的 Git 仓库

### 2. 配置环境变量

部署前，**必须在 Vercel 项目设置中配置以下环境变量**：

| 变量 | 示例 | 说明 |
|-----|------|------|
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | **必需**。生产数据库连接字符串 |
| `JWT_SECRET` | `abc123...` (64 字符) | **必需**。认证 JWT 密钥，至少 32 字符 |
| `SESSION_SECRET` | `xyz789...` (64 字符) | **必需**。会话加密密钥，至少 32 字符 |
| `NEXT_PUBLIC_API_URL` | `https://yourdomain.com` | API 基础 URL |
| `NODE_ENV` | `production` | 环境标识 |

**生成强密钥的方法：**
```bash
# 在本地运行：
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. 设置环境变量步骤

1. 在 Vercel 项目页面，点击 **Settings**
2. 选择 **Environment Variables**
3. 添加每个必需的变量
4. 确保为 **Production**、**Preview**、**Development** 分别设置（或全部勾选）

### 4. 触发部署

部署会在以下情况自动触发：
- 推送到主分支
- 打开 Pull Request

或手动部署：
- 在 Vercel 项目页面点击 "Deploy"

## 构建配置

### Build Command
```bash
pnpm run build
```

### Output Directory
```
.next
```

这些已在 `next.config.ts` 中配置，Vercel 会自动检测。

## 预构建检查清单

部署前确保：

- [ ] `.env.example` 文件已创建，包含所有必需的环境变量
- [ ] 本地 `pnpm build` 成功执行
- [ ] ESLint 检查通过: `pnpm lint`
- [ ] 所有环境变量都在 Vercel 中配置
- [ ] 数据库连接字符串正确（包括 SSL 设置）

## 常见问题

### ❌ 构建失败: "Invalid environment variables"

**原因**: 缺少必需的环境变量

**解决方案**:
1. 检查 Vercel Environment Variables 设置
2. 确认 `JWT_SECRET` 和 `SESSION_SECRET` 已配置
3. 确保 `DATABASE_URL` 有效

### ❌ 构建失败: "Cannot connect to database"

**原因**: 数据库连接字符串无效或数据库不可达

**解决方案**:
1. 验证 `DATABASE_URL` 是否正确
2. 检查数据库是否运行且可从 Vercel 访问
3. 如果使用 SSL，确保 `DB_SSL=true`

### ❌ 页面加载失败: "500 Internal Server Error"

**原因**: 运行时环境变量问题或数据库连接问题

**解决方案**:
1. 检查 Vercel 日志: Functions > 查看错误日志
2. 确认数据库在生产环境可访问
3. 检查 `NODE_ENV` 是否为 `production`

## 监控和调试

### 查看部署日志

1. 在 Vercel 项目页面，找到部署记录
2. 点击部署，查看 **Build Logs**
3. 查看 **Function Logs** 了解运行时错误

### 本地测试生产构建

```bash
# 本地模拟 Vercel 构建
pnpm build

# 启动生产服务器
pnpm start
```

## 安全注意事项

⚠️ **从不在代码中提交敏感信息**：
- 不要在 Git 中提交 `.env.local` 或 `.env.production.local`
- 所有密钥都应通过 Vercel 环境变量配置
- `.env.example` 仅包含示例，不包含实际密钥

## 回滚部署

如果需要回滚到之前的版本：
1. 在 Vercel 项目，找到之前成功的部署
2. 点击 "Promote to Production"

或通过 Git 回滚提交并推送。

---

有问题？查看 [Vercel 官方文档](https://vercel.com/docs)

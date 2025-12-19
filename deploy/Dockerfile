# ============================================
# Multi-Stage Build Dockerfile for Next.js 16
# Production-optimized build
# ============================================

# Stage 1: Dependencies (缓存优化)
FROM node:20-alpine AS deps
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@9

# 只复制 package 文件以充分利用缓存
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# ============================================
# Stage 2: Builder (构建阶段)
FROM node:20-alpine AS builder
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm@9

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 移除 pnpm-workspace.yaml 避免 workspace 错误（必须在 COPY 之后）
RUN rm -f pnpm-workspace.yaml

# 构建应用
RUN pnpm build

# ============================================
# Stage 3: Runtime (运行时)
FROM node:20-alpine AS runner
WORKDIR /app

# 设置环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 安装 pnpm
RUN npm install -g pnpm@9

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# 复制构建产物和依赖
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# 更改文件所有权
RUN chown -R nextjs:nodejs /app

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# 启动应用
CMD ["node", ".next/standalone/server.js"]

# ============================================
# Build args 和 labels
LABEL maintainer="Coconut Team"
LABEL description="Next.js 16 - Production Docker Image"
LABEL version="1.0"

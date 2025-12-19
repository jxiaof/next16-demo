# 📦 部署快速参考 (Deployment Quick Reference)

## 🎯 5 分钟快速启动

### Docker Compose 生产部署

```bash
# 1. 复制环境变量
cp deploy/.env.example .env.production.local

# 2. 修改敏感信息（数据库密码等）
vim .env.production.local

# 3. 启动所有服务
make docker-run

# 4. 访问应用
open http://localhost:3000

# 5. 停止服务
make docker-stop
```

---

## 🐳 Docker 常用命令

| 命令 | 作用 |
|-----|------|
| `make docker-build` | 构建生产镜像 |
| `make docker-run` | 启动容器（含 DB + Redis + Nginx） |
| `make docker-logs` | 查看日志 |
| `make docker-stop` | 停止容器 |
| `make docker-shell` | 进入应用容器 |
| `make docker-clean` | 清理镜像和数据 |

---

## ☸️ Kubernetes 常用命令

### 初始部署

```bash
# 1. 推送镜像
make docker-push DOCKER_REGISTRY=your-registry.com DOCKER_TAG=v1.0

# 2. 部署到集群
make k8s-apply K8S_NAMESPACE=default

# 3. 执行数据库迁移
make k8s-shell
# 在 Pod 内：pnpm db:migrate
```

### 日常管理

| 命令 | 作用 |
|-----|------|
| `make k8s-status` | 查看部署状态 |
| `make k8s-logs` | 查看 Pod 日志 |
| `make k8s-scale REPLICAS=5` | 扩展 Pod |
| `make k8s-port-forward` | 本地访问 (localhost:3000) |
| `make k8s-rollout-restart` | 重启部署 |
| `make k8s-rollout-undo` | 回滚版本 |

---

## 💾 数据库命令

| 命令 | 作用 |
|-----|------|
| `make db-up` | 启动 PostgreSQL + Redis |
| `make migrate-db` | 执行迁移 |
| `make seed-db` | 填充测试数据 |
| `make studio` | 启动 Drizzle Studio (UI) |

---

## 📁 文件结构

```
deploy/
├── Dockerfile              # 生产镜像 (多阶段构建)
├── Dockerfile.dev          # 开发镜像 (热重载)
├── docker-compose.prod.yml # 完整 Docker 栈
├── nginx.conf             # Nginx 反向代理配置
├── k8s-deployment.yaml    # K8s Deployment (3 副本 + HPA)
├── k8s-service.yaml       # K8s Service (ClusterIP/LB)
├── k8s-ingress.yaml       # K8s Ingress (SSL + 路由)
├── k8s-configmap.yaml     # K8s ConfigMap (配置)
├── k8s-rbac.yaml          # K8s RBAC (权限)
├── k8s-namespace.yaml     # K8s Namespace (隔离)
├── .dockerignore           # Docker 忽略列表
├── .env.example            # 环境变量模板
└── DEPLOYMENT_GUIDE.md     # 完整部署文档
```

---

## 🔐 环境变量配置

### 必需配置

```bash
# 数据库
DATABASE_URL=postgresql://user:pass@postgres:5432/coconut_db

# Redis
REDIS_URL=redis://:password@redis:6379/0

# 密钥
JWT_SECRET=your-jwt-secret-key
SESSION_SECRET=your-session-secret-key
```

### 完整列表

查看 `deploy/.env.example` 了解所有可配置项

---

## 🚀 部署流程

### 开发环境

```bash
make up          # 启动所有服务
make dev         # 开发服务器 (hot reload)
make lint        # ESLint 检查
make down        # 停止所有服务
```

### 测试环境

```bash
make ci           # 运行完整 CI 检查
make docker-build # 构建镜像
```

### 生产环境 (Docker)

```bash
# 检查
make env-check

# 构建
make docker-build

# 部署
make docker-run

# 验证
docker-compose -f deploy/docker-compose.prod.yml ps
curl http://localhost/api/health
```

### 生产环境 (Kubernetes)

```bash
# 推送镜像
make docker-push DOCKER_REGISTRY=myregistry.com

# 更新 k8s 配置文件中的镜像 URL

# 部署
make k8s-apply

# 验证
make k8s-status
make k8s-logs
```

---

## ⚡ 性能优化清单

### Docker 部分
- ✅ 多阶段构建，镜像体积优化
- ✅ 非 root 用户运行
- ✅ 健康检查配置
- ✅ 资源限制 (CPU/Memory)

### Kubernetes 部分
- ✅ 3 副本高可用
- ✅ HPA 自动扩展 (CPU/Memory)
- ✅ Pod 反亲和性
- ✅ 就绪/存活探针
- ✅ 优雅关闭 (30s 超时)

### Nginx 部分
- ✅ Gzip 压缩
- ✅ 缓存配置
- ✅ 速率限制
- ✅ SSL/TLS 1.2+

---

## 🔍 故障排查速查表

| 问题 | 诊断 | 解决 |
|-----|------|------|
| 容器启动失败 | `docker logs <id>` | 查看日志，检查环境变量 |
| DB 连接失败 | `docker exec -it postgres pg_isready` | 确保 DB 容器已启动 |
| 端口被占用 | `lsof -i :3000` | 释放端口：`kill -9 <PID>` |
| K8s Pod Pending | `kubectl describe pod <name>` | 检查资源配额和节点资源 |
| 无法访问 | `kubectl port-forward` | 测试本地连接 |

---

## 📊 监控命令

### Docker
```bash
docker stats                    # 实时统计
docker logs -f <container>     # 日志流
docker inspect <container>     # 详细信息
```

### Kubernetes
```bash
kubectl top pods               # 资源使用
kubectl logs -f <pod>         # 日志流
kubectl describe pod <pod>    # 详细信息
kubectl get events            # 集群事件
```

---

## 🔄 更新和回滚

### 更新版本

```bash
# Docker
docker build -t app:v1.1 .
docker-compose -f deploy/docker-compose.prod.yml up -d

# Kubernetes
kubectl set image deployment/app app=myrepo/app:v1.1
kubectl rollout status deployment/app
```

### 回滚版本

```bash
# Docker (重新启动旧容器)
docker-compose -f deploy/docker-compose.prod.yml up -d

# Kubernetes
kubectl rollout undo deployment/coconut-oil-app
kubectl rollout status deployment/coconut-oil-app
```

---

## 📚 完整文档链接

- 📖 [完整部署指南](./DEPLOYMENT_GUIDE.md)
- 🐳 [Docker 多阶段构建](./Dockerfile)
- ☸️ [Kubernetes 完整配置](./k8s-deployment.yaml)
- 🔧 [Makefile 命令参考](../Makefile)

---

## ✅ 部署前检查清单

- [ ] 环境变量已配置
- [ ] 数据库备份已创建
- [ ] SSL 证书已准备
- [ ] DNS 记录已更新
- [ ] 日志收集已配置
- [ ] 监控告警已设置
- [ ] 测试通过：`make ci`
- [ ] Docker 镜像已构建：`make docker-build`
- [ ] K8s 配置已更新（如使用 K8s）

---

## 🎯 常见场景

### 场景 1: 本地快速测试

```bash
make setup     # 一键初始化
make up        # 启动所有服务
make dev       # 开发模式
```

### 场景 2: 单机 Docker 部署

```bash
cp deploy/.env.example .env.production.local
# 编辑环境变量
make docker-build
make docker-run
```

### 场景 3: K8s 集群部署

```bash
make docker-push DOCKER_REGISTRY=registry.example.com
# 更新 k8s 配置文件
make k8s-apply
make k8s-status
```

---

**更新于**: 2024 年  
**版本**: 1.0  
**快速参考**: 5 分钟上手 ⚡


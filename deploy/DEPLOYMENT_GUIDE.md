# Coconut Oil - 部署指南

## 📋 目录

1. [快速开始](#快速开始)
2. [Docker 部署](#docker-部署)
3. [Kubernetes 部署](#kubernetes-部署)
4. [生产环境检查清单](#生产环境检查清单)
5. [故障排查](#故障排查)

---

## 快速开始

### 前置要求

- Node.js 20+
- Docker & Docker Compose
- kubectl (用于 K8s 部署)
- pnpm 或 npm

### 环境设置

```bash
# 1. 复制环境变量文件
cp deploy/.env.example .env.production.local

# 2. 编辑环境变量（修改敏感信息）
vim .env.production.local

# 3. 安装依赖
make install

# 4. 检查环境
make env-check
```

---

## Docker 部署

### 本地开发

```bash
# 启动完整开发环境
make up

# 停止环境
make down
```

### 生产部署 - Docker Compose

```bash
# 1. 构建镜像
make docker-build

# 2. 启动容器
make docker-run

# 3. 查看日志
make docker-logs

# 4. 停止容器
make docker-stop
```

**访问地址**: http://localhost:3000

### 手动步骤

```bash
# 构建镜像
docker build -f deploy/Dockerfile -t coconut-oil:latest .

# 启动所有服务（PostgreSQL + Redis + App + Nginx）
docker-compose -f deploy/docker-compose.prod.yml up -d

# 查看所有容器状态
docker-compose -f deploy/docker-compose.prod.yml ps

# 查看应用日志
docker-compose -f deploy/docker-compose.prod.yml logs -f app

# 执行数据库迁移
docker-compose -f deploy/docker-compose.prod.yml exec app pnpm db:migrate

# 填充测试数据
docker-compose -f deploy/docker-compose.prod.yml exec app pnpm db:seed

# 停止所有服务
docker-compose -f deploy/docker-compose.prod.yml down
```

---

## Kubernetes 部署

### 前置条件

- Kubernetes 集群（1.24+）
- kubectl 连接配置
- Docker 镜像推送到仓库

### 部署步骤

#### 1. 配置和推送镜像

```bash
# 设置镜像仓库
export DOCKER_REGISTRY=your-docker-registry.com
export DOCKER_IMAGE=$DOCKER_REGISTRY/coconut-oil
export DOCKER_TAG=v1.0.0

# 构建并推送镜像
make docker-push
```

#### 2. 更新 K8s 配置

编辑 `deploy/k8s-configmap.yaml` 和 `deploy/k8s-deployment.yaml`:

```yaml
# k8s-deployment.yaml
image: your-docker-registry.com/coconut-oil:v1.0.0

# k8s-configmap.yaml
api-url: "https://api.your-domain.com"
```

#### 3. 部署到集群

```bash
# 使用 Makefile
make k8s-apply K8S_NAMESPACE=default

# 或手动执行
kubectl apply -f deploy/k8s-namespace.yaml
kubectl apply -f deploy/k8s-configmap.yaml
kubectl apply -f deploy/k8s-rbac.yaml
kubectl apply -f deploy/k8s-deployment.yaml
kubectl apply -f deploy/k8s-service.yaml
kubectl apply -f deploy/k8s-ingress.yaml
```

#### 4. 检查部署状态

```bash
# 查看所有资源
kubectl get all -n default -l app=coconut-oil

# 查看 Pod 状态
kubectl get pods -n default -l app=coconut-oil

# 查看详细信息
kubectl describe deployment coconut-oil-app -n default

# 查看日志
make k8s-logs

# 端口转发本地访问
make k8s-port-forward
# 然后访问 http://localhost:3000
```

#### 5. 数据库迁移

```bash
# 进入 Pod shell
make k8s-shell

# 在 Pod 内执行迁移
pnpm db:migrate
pnpm db:seed
```

#### 6. 扩展和管理

```bash
# 扩展 Pod 副本数
make k8s-scale REPLICAS=5

# 查看自动扩展状态
kubectl get hpa -n default

# 重启部署
make k8s-rollout-restart

# 回滚到上一个版本
make k8s-rollout-undo

# 查看更新状态
make k8s-rollout-status
```

---

## 生产环境检查清单

### 部署前检查

- [ ] 所有环境变量已设置（特别是敏感信息）
- [ ] 数据库备份已创建
- [ ] SSL 证书已配置
- [ ] DNS 记录已指向正确的 IP/负载均衡器
- [ ] 日志收集系统已配置
- [ ] 监控告警已设置
- [ ] 备灾计划已制定

### 应用配置检查

- [ ] `NODE_ENV=production`
- [ ] `NEXT_TELEMETRY_DISABLED=1`
- [ ] 所有外部 API 密钥已配置
- [ ] 邮件服务已验证
- [ ] 支付网关已测试（如适用）

### 基础设施检查

- [ ] 数据库性能已优化（索引、连接池）
- [ ] Redis 缓存已配置
- [ ] CDN 已配置（可选）
- [ ] 文件存储已配置（如使用 S3 等）
- [ ] 备份策略已实施

### 安全检查

- [ ] HTTPS/SSL 已启用
- [ ] CSRF 保护已启用
- [ ] CORS 配置正确
- [ ] 认证和授权测试通过
- [ ] 密钥管理系统已部署
- [ ] 日志中无敏感信息泄露

### Kubernetes 特定检查

- [ ] 资源配额已设置
- [ ] 网络策略已配置
- [ ] PodDisruptionBudget 已设置
- [ ] 自动扩展已配置
- [ ] 健康检查响应正常
- [ ] RBAC 权限正确

---

## 故障排查

### Docker 相关问题

#### 容器启动失败

```bash
# 查看详细日志
docker-compose -f deploy/docker-compose.prod.yml logs app

# 检查镜像是否存在
docker images | grep coconut-oil

# 重新构建镜像
make docker-build

# 清理并重新启动
make docker-clean
make docker-run
```

#### 数据库连接错误

```bash
# 检查 PostgreSQL 状态
docker-compose -f deploy/docker-compose.prod.yml exec postgres pg_isready

# 查看 PostgreSQL 日志
docker-compose -f deploy/docker-compose.prod.yml logs postgres

# 重启数据库
docker-compose -f deploy/docker-compose.prod.yml restart postgres
```

### Kubernetes 相关问题

#### Pod 处于 Pending 状态

```bash
# 查看 Pod 详细信息
kubectl describe pod <pod-name> -n default

# 检查节点资源
kubectl top nodes

# 检查事件
kubectl get events -n default --sort-by='.lastTimestamp'
```

#### Pod 不断重启

```bash
# 查看 Pod 日志
kubectl logs <pod-name> -n default

# 查看之前崩溃的日志
kubectl logs <pod-name> -n default --previous

# 检查启动探针
kubectl describe pod <pod-name> -n default | grep -A 10 "Startup Probe"
```

#### 无法访问应用

```bash
# 检查 Service
kubectl get svc -n default

# 检查 Ingress
kubectl get ingress -n default
kubectl describe ingress coconut-oil-ingress -n default

# 测试网络连通性
kubectl run -it --rm debug --image=busybox --restart=Never -- sh
# 在 Pod 内：
curl http://coconut-oil-service/api/health
```

### 常见错误消息

| 错误 | 原因 | 解决方案 |
|-----|------|--------|
| `EADDRINUSE: port 3000` | 端口被占用 | `lsof -i :3000` 查找进程，`kill -9 <PID>` 终止 |
| `Connection refused` | 数据库未启动 | `make db-up` 启动数据库 |
| `Out of memory` | 内存不足 | 增加容器内存限制或 Pod resources |
| `ReadinessProbe failed` | 应用未就绪 | 检查日志，可能是数据库连接问题 |

---

## 监控和维护

### 日志查看

```bash
# Docker
make docker-logs

# Kubernetes
make k8s-logs

# 特定容器
kubectl logs deployment/coconut-oil-app -n default -c coconut-oil
```

### 性能监控

```bash
# Kubernetes 资源使用
kubectl top pods -n default
kubectl top nodes

# Docker 容器统计
docker stats
```

### 数据库维护

```bash
# 数据库备份
docker-compose -f deploy/docker-compose.prod.yml exec postgres \
  pg_dump -U postgres coconut_db > backup.sql

# 数据库恢复
docker-compose -f deploy/docker-compose.prod.yml exec -T postgres \
  psql -U postgres coconut_db < backup.sql

# 进入数据库 shell
make db-shell
```

---

## 更新和回滚

### Docker 更新

```bash
# 构建新版本
docker build -f deploy/Dockerfile -t coconut-oil:v1.1.0 .

# 更新容器
docker-compose -f deploy/docker-compose.prod.yml up -d
```

### Kubernetes 更新

```bash
# 更新镜像
kubectl set image deployment/coconut-oil-app \
  coconut-oil=coconut-oil:v1.1.0 -n default

# 查看更新状态
make k8s-rollout-status

# 如需回滚
make k8s-rollout-undo
```

---

## 参考资源

- [Docker 官方文档](https://docs.docker.com/)
- [Kubernetes 官方文档](https://kubernetes.io/docs/)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [Nginx 官方文档](https://nginx.org/en/docs/)

---

**最后更新**: 2024 年  
**维护者**: Coconut 团队

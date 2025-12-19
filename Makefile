# ============================================
# Makefile for Coconut Oil Project
# ============================================

.PHONY: help build dev prod lint test clean \
        docker-build docker-push docker-run \
        k8s-apply k8s-delete k8s-logs k8s-port-forward \
        migrate-db seed-db reset-db studio \
        deploy-staging deploy-prod

# 默认目标
.DEFAULT_GOAL := help

# 颜色定义
BLUE := \033[0;34m
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# 变量定义
PROJECT_NAME ?= coconut-oil
DOCKER_REGISTRY ?= docker.io
DOCKER_IMAGE ?= $(DOCKER_REGISTRY)/$(PROJECT_NAME)
DOCKER_TAG ?= latest
K8S_NAMESPACE ?= default
K8S_CONTEXT ?= default

help: ## 显示帮助信息
	@echo "$(BLUE)╔════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║   Coconut Oil Project - Makefile      ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════╝$(NC)"
	@echo ""
	@echo "$(GREEN)📦 本地开发:$(NC)"
	@grep -E '^.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; /^[a-z]/ && !/^docker|^k8s|^deploy/ {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' | head -20
	@echo ""
	@echo "$(GREEN)🐳 Docker 命令:$(NC)"
	@grep -E '^docker.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)☸️  Kubernetes 命令:$(NC)"
	@grep -E '^k8s.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)💾 数据库命令:$(NC)"
	@grep -E '^(migrate|seed|reset|studio).*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(GREEN)🚀 部署命令:$(NC)"
	@grep -E '^deploy.*:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""

# ============================================
# 本地开发命令
# ============================================

build: ## 构建应用
	@echo "$(BLUE)📦 Building application...$(NC)"
	pnpm install
	pnpm build
	@echo "$(GREEN)✓ Build complete!$(NC)"

dev: ## 启动开发服务器
	@echo "$(BLUE)🚀 Starting development server...$(NC)"
	pnpm dev

lint: ## 运行 ESLint
	@echo "$(BLUE)🔍 Linting code...$(NC)"
	pnpm lint
	@echo "$(GREEN)✓ Lint complete!$(NC)"

format: ## 格式化代码
	@echo "$(BLUE)✨ Formatting code...$(NC)"
	pnpm exec prettier --write "src/**/*.{ts,tsx,json,css}"
	@echo "$(GREEN)✓ Format complete!$(NC)"

test: ## 运行测试
	@echo "$(BLUE)🧪 Running tests...$(NC)"
	@if [ -f "jest.config.js" ] || [ -f "vitest.config.ts" ]; then \
		pnpm test; \
	else \
		echo "$(YELLOW)⚠ No test configuration found$(NC)"; \
	fi

clean: ## 清理构建产物
	@echo "$(BLUE)🧹 Cleaning build artifacts...$(NC)"
	rm -rf .next build dist node_modules .turbo
	@echo "$(GREEN)✓ Clean complete!$(NC)"

install: ## 安装依赖
	@echo "$(BLUE)📦 Installing dependencies...$(NC)"
	pnpm install
	@echo "$(GREEN)✓ Install complete!$(NC)"

# ============================================
# Docker 命令
# ============================================

docker-build: ## 构建 Docker 镜像
	@echo "$(BLUE)🐳 Building Docker image: $(DOCKER_IMAGE):$(DOCKER_TAG)$(NC)"
	docker build -f deploy/Dockerfile -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) $(DOCKER_IMAGE):latest
	@echo "$(GREEN)✓ Docker build complete!$(NC)"

docker-build-amd64: ## 构建 amd64 Docker 镜像
	@echo "$(BLUE)🐳 Building Docker image: $(DOCKER_IMAGE):$(DOCKER_TAG)$(NC)"
	docker build --platform linux/amd64 -f deploy/Dockerfile -t $(DOCKER_IMAGE):$(DOCKER_TAG) .
	docker tag $(DOCKER_IMAGE):$(DOCKER_TAG) $(DOCKER_IMAGE):latest
	@echo "$(GREEN)✓ Docker build complete!$(NC)"

docker-build-dev: ## 构建开发 Docker 镜像
	@echo "$(BLUE)🐳 Building dev Docker image: $(DOCKER_IMAGE):dev$(NC)"
	docker build -f deploy/Dockerfile.dev -t $(DOCKER_IMAGE):dev .
	@echo "$(GREEN)✓ Docker dev build complete!$(NC)"

docker-push: docker-build ## 推送 Docker 镜像到仓库
	@echo "$(BLUE)🚀 Pushing Docker image to registry...$(NC)"
	docker push $(DOCKER_IMAGE):$(DOCKER_TAG)
	docker push $(DOCKER_IMAGE):latest
	@echo "$(GREEN)✓ Docker push complete!$(NC)"

docker-run: ## 运行 Docker 容器（生产）
	@echo "$(BLUE)🚀 Running Docker container...$(NC)"
	docker-compose -f deploy/docker-compose.prod.yml up -d
	@echo "$(GREEN)✓ Container running!$(NC)"
	@echo "访问地址: http://localhost:3000"

docker-run-dev: docker-build-dev ## 运行开发 Docker 容器
	@echo "$(BLUE)🚀 Running dev Docker container...$(NC)"
	docker run -it --rm \
		-v $(PWD):/app \
		-v /app/node_modules \
		-p 3000:3000 \
		--env-file .env.development.local \
		$(DOCKER_IMAGE):dev
	@echo "$(GREEN)✓ Dev container stopped!$(NC)"

docker-stop: ## 停止 Docker 容器
	@echo "$(BLUE)⏹  Stopping Docker containers...$(NC)"
	docker-compose -f deploy/docker-compose.prod.yml down
	@echo "$(GREEN)✓ Containers stopped!$(NC)"

docker-logs: ## 显示 Docker 日志
	@echo "$(BLUE)📋 Docker logs:$(NC)"
	docker-compose -f deploy/docker-compose.prod.yml logs -f

docker-shell: ## 进入应用容器 shell
	@echo "$(BLUE)🐚 Entering app container shell...$(NC)"
	docker-compose -f deploy/docker-compose.prod.yml exec app sh

docker-clean: ## 清理 Docker 镜像和容器
	@echo "$(BLUE)🧹 Cleaning Docker images and containers...$(NC)"
	docker-compose -f deploy/docker-compose.prod.yml down -v
	docker rmi $(DOCKER_IMAGE):$(DOCKER_TAG) $(DOCKER_IMAGE):latest || true
	@echo "$(GREEN)✓ Docker cleanup complete!$(NC)"

# ============================================
# Kubernetes 命令
# ============================================

k8s-apply: ## 部署应用到 Kubernetes
	@echo "$(BLUE)☸️  Deploying to Kubernetes namespace: $(K8S_NAMESPACE)$(NC)"
	kubectl create namespace $(K8S_NAMESPACE) --dry-run=client -o yaml | kubectl apply -f -
	kubectl apply -f deploy/k8s-namespace.yaml
	kubectl apply -f deploy/k8s-configmap.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f deploy/k8s-rbac.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f deploy/k8s-deployment.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f deploy/k8s-service.yaml -n $(K8S_NAMESPACE)
	kubectl apply -f deploy/k8s-ingress.yaml -n $(K8S_NAMESPACE)
	@echo "$(GREEN)✓ Kubernetes deployment complete!$(NC)"

k8s-delete: ## 从 Kubernetes 删除应用
	@echo "$(BLUE)☸️  Deleting from Kubernetes namespace: $(K8S_NAMESPACE)$(NC)"
	kubectl delete -f deploy/k8s-ingress.yaml -n $(K8S_NAMESPACE) --ignore-not-found
	kubectl delete -f deploy/k8s-service.yaml -n $(K8S_NAMESPACE) --ignore-not-found
	kubectl delete -f deploy/k8s-deployment.yaml -n $(K8S_NAMESPACE) --ignore-not-found
	@echo "$(GREEN)✓ Kubernetes deletion complete!$(NC)"

k8s-logs: ## 显示 Kubernetes Pod 日志
	@echo "$(BLUE)📋 Kubernetes logs:$(NC)"
	kubectl logs -f deployment/coconut-oil-app -n $(K8S_NAMESPACE) --all-containers=true

k8s-shell: ## 进入 Kubernetes Pod shell
	@echo "$(BLUE)🐚 Entering K8s pod shell...$(NC)"
	@POD=$$(kubectl get pods -n $(K8S_NAMESPACE) -l app=coconut-oil -o jsonpath='{.items[0].metadata.name}') && \
	kubectl exec -it $$POD -n $(K8S_NAMESPACE) -- sh

k8s-port-forward: ## 端口转发 (本地访问)
	@echo "$(BLUE)🔗 Port forwarding to pod...$(NC)"
	kubectl port-forward svc/coconut-oil-service -n $(K8S_NAMESPACE) 3000:80

k8s-status: ## 显示 Kubernetes 部署状态
	@echo "$(BLUE)📊 Kubernetes deployment status:$(NC)"
	kubectl get deployment,pod,svc -n $(K8S_NAMESPACE) -l app=coconut-oil
	@echo ""
	@echo "$(YELLOW)Pod details:$(NC)"
	kubectl describe pods -n $(K8S_NAMESPACE) -l app=coconut-oil

k8s-scale: ## 缩放 Kubernetes 部署 (用法: make k8s-scale REPLICAS=5)
	@echo "$(BLUE)☸️  Scaling deployment to $(REPLICAS) replicas...$(NC)"
	kubectl scale deployment coconut-oil-app -n $(K8S_NAMESPACE) --replicas=$(REPLICAS)
	@echo "$(GREEN)✓ Scaling complete!$(NC)"

k8s-rollout-status: ## 显示 Kubernetes 部署进度
	@echo "$(BLUE)📊 Kubernetes rollout status:$(NC)"
	kubectl rollout status deployment/coconut-oil-app -n $(K8S_NAMESPACE)

k8s-rollout-restart: ## 重启 Kubernetes 部署
	@echo "$(BLUE)🔄 Restarting deployment...$(NC)"
	kubectl rollout restart deployment/coconut-oil-app -n $(K8S_NAMESPACE)
	@echo "$(GREEN)✓ Restart complete!$(NC)"

k8s-rollout-undo: ## 回滚 Kubernetes 部署
	@echo "$(BLUE)🔙 Rolling back deployment...$(NC)"
	kubectl rollout undo deployment/coconut-oil-app -n $(K8S_NAMESPACE)
	@echo "$(GREEN)✓ Rollback complete!$(NC)"

# ============================================
# 数据库命令
# ============================================

db-up: ## 启动数据库服务
	@echo "$(BLUE)📦 Starting database services...$(NC)"
	docker-compose -f infra/docker-compose.yml up -d
	@echo "$(GREEN)✓ Database services running!$(NC)"

db-down: ## 停止数据库服务
	@echo "$(BLUE)⏹  Stopping database services...$(NC)"
	docker-compose -f infra/docker-compose.yml down
	@echo "$(GREEN)✓ Database services stopped!$(NC)"

migrate-db: ## 执行数据库迁移
	@echo "$(BLUE)📦 Running database migrations...$(NC)"
	pnpm db:migrate
	@echo "$(GREEN)✓ Migrations complete!$(NC)"

seed-db: ## 填充测试数据
	@echo "$(BLUE)🌱 Seeding database...$(NC)"
	pnpm db:seed
	@echo "$(GREEN)✓ Seeding complete!$(NC)"

reset-db: ## 重置数据库（危险！）
	@echo "$(RED)⚠️  WARNING: This will reset the database!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)🔄 Resetting database...$(NC)"; \
		pnpm db:reset; \
		echo "$(GREEN)✓ Database reset complete!$(NC)"; \
	else \
		echo "$(YELLOW)Cancelled$(NC)"; \
	fi

studio: ## 启动 Drizzle Studio（数据库管理 UI）
	@echo "$(BLUE)🎨 Starting Drizzle Studio...$(NC)"
	pnpm db:studio

db-logs: ## 显示数据库日志
	@echo "$(BLUE)📋 Database logs:$(NC)"
	docker-compose -f infra/docker-compose.yml logs -f postgres

# ============================================
# 部署命令
# ============================================

deploy-staging: build docker-build ## 部署到 Staging 环境
	@echo "$(BLUE)🚀 Deploying to Staging environment...$(NC)"
	@echo "$(YELLOW)Note: Configure staging deployment as needed$(NC)"
	docker tag $(DOCKER_IMAGE):latest $(DOCKER_IMAGE):staging
	docker push $(DOCKER_IMAGE):staging
	@echo "$(GREEN)✓ Staging deployment initiated!$(NC)"

deploy-prod: build docker-build docker-push ## 部署到生产环境
	@echo "$(BLUE)🚀 Deploying to Production environment...$(NC)"
	@echo "$(RED)⚠️  This will deploy to PRODUCTION!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		echo "$(BLUE)Updating K8s deployment...$(NC)"; \
		kubectl set image deployment/coconut-oil-app \
			coconut-oil=$(DOCKER_IMAGE):$(DOCKER_TAG) \
			-n $(K8S_NAMESPACE); \
		kubectl rollout status deployment/coconut-oil-app -n $(K8S_NAMESPACE); \
		echo "$(GREEN)✓ Production deployment complete!$(NC)"; \
	else \
		echo "$(YELLOW)Production deployment cancelled$(NC)"; \
	fi

# ============================================
# 综合命令
# ============================================

setup: install db-up migrate-db seed-db ## 完整项目设置
	@echo "$(GREEN)✓ Project setup complete!$(NC)"

up: db-up dev ## 启动完整开发环境
	@echo "$(GREEN)✓ Development environment running!$(NC)"

down: db-down ## 停止完整开发环境
	@echo "$(GREEN)✓ Development environment stopped!$(NC)"

ci: lint build test ## 运行 CI 检查
	@echo "$(GREEN)✓ CI checks passed!$(NC)"

# ============================================
# 实用工具命令
# ============================================

version: ## 显示项目版本信息
	@echo "$(BLUE)📦 Project Information:$(NC)"
	@echo "  Project: $(PROJECT_NAME)"
	@echo "  Docker Image: $(DOCKER_IMAGE):$(DOCKER_TAG)"
	@echo "  K8s Namespace: $(K8S_NAMESPACE)"
	@echo "  K8s Context: $(K8S_CONTEXT)"
	@if [ -f package.json ]; then \
		echo "  Version: $$(grep '\"version\"' package.json | cut -d'"' -f4)"; \
	fi

env-check: ## 检查必要的环境工具
	@echo "$(BLUE)🔍 Checking environment...$(NC)"
	@command -v docker >/dev/null 2>&1 && echo "  $(GREEN)✓$(NC) Docker" || echo "  $(RED)✗$(NC) Docker"
	@command -v docker-compose >/dev/null 2>&1 && echo "  $(GREEN)✓$(NC) Docker Compose" || echo "  $(RED)✗$(NC) Docker Compose"
	@command -v kubectl >/dev/null 2>&1 && echo "  $(GREEN)✓$(NC) kubectl" || echo "  $(RED)✗$(NC) kubectl"
	@command -v pnpm >/dev/null 2>&1 && echo "  $(GREEN)✓$(NC) pnpm" || echo "  $(RED)✗$(NC) pnpm"
	@command -v node >/dev/null 2>&1 && echo "  $(GREEN)✓$(NC) Node.js" || echo "  $(RED)✗$(NC) Node.js"

.PHONY: env-check version ci down up setup deploy-prod deploy-staging db-logs studio reset-db seed-db migrate-db db-down db-up k8s-rollout-undo k8s-rollout-restart k8s-rollout-status k8s-scale k8s-status k8s-port-forward k8s-shell k8s-logs k8s-delete k8s-apply docker-clean docker-shell docker-logs docker-stop docker-run-dev docker-run docker-push docker-build-dev docker-build clean test format lint dev build help

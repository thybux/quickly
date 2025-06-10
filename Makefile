# Makefile pour Quickly Library

.PHONY: help install build test bench clean dev setup report

# Variables
SCRIPT_DIR := scripts
TEST_SCRIPT := $(SCRIPT_DIR)/test-and-bench.sh

# Couleurs pour l'affichage
BLUE := \033[34m
GREEN := \033[32m
YELLOW := \033[33m
NC := \033[0m

help: ## Affiche cette aide
	@echo "$(BLUE)Quickly Library - Commandes disponibles:$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(YELLOW)Exemples:$(NC)"
	@echo "  make setup     # Configuration initiale complète"
	@echo "  make test      # Tests rapides"
	@echo "  make bench     # Benchmarks complets"
	@echo "  make dev       # Mode développement"

setup: ## Configuration initiale complète du projet
	@echo "$(BLUE)🔧 Configuration initiale...$(NC)"
	@chmod +x $(TEST_SCRIPT)
	@$(TEST_SCRIPT) full

install: ## Installation des dépendances
	@echo "$(BLUE)📦 Installation des dépendances...$(NC)"
	@npm install

build: ## Build complet (Rust + TypeScript)
	@echo "$(BLUE)🔨 Build complet...$(NC)"
	@npm run build

clean: ## Nettoyage des fichiers générés
	@echo "$(BLUE)🧹 Nettoyage...$(NC)"
	@npm run clean

# === Tests ===

test: ## Tests rapides
	@echo "$(BLUE)🧪 Tests rapides...$(NC)"
	@chmod +x $(TEST_SCRIPT)
	@$(TEST_SCRIPT) quick

test-full: ## Tests complets avec couverture
	@echo "$(BLUE)🧪 Tests complets...$(NC)"
	@chmod +x $(TEST_SCRIPT)
	@$(TEST_SCRIPT) test-only

test-math: ## Tests des opérations mathématiques uniquement
	@echo "$(BLUE)🧮 Tests mathématiques...$(NC)"
	@npm run test:math

test-watch: ## Tests en mode watch
	@echo "$(BLUE)👀 Tests en mode watch...$(NC)"
	@npm run test:watch

# === Benchmarks ===

bench: ## Benchmarks complets
	@echo "$(BLUE)📊 Benchmarks complets...$(NC)"
	@chmod +x $(TEST_SCRIPT)
	@$(TEST_SCRIPT) bench-only

bench-quick: ## Benchmarks rapides
	@echo "$(BLUE)⚡ Benchmarks rapides...$(NC)"
	@npm run perf:quick

# === Développement ===

dev: ## Mode développement avec watch
	@echo "$(BLUE)🔄 Mode développement...$(NC)"
	@npm run dev

dev-test: ## Mode développement avec tests
	@echo "$(BLUE)🔄 Développement + tests...$(NC)"
	@make build && make test-watch

# === Validation ===

check: ## Vérification complète (tests + benchmarks)
	@echo "$(BLUE)✅ Vérification complète...$(NC)"
	@chmod +x $(TEST_SCRIPT)
	@$(TEST_SCRIPT) full

validate: ## Validation avant commit
	@echo "$(BLUE)🔍 Validation pré-commit...$(NC)"
	@make clean
	@make build
	@make test-full
	@echo "$(GREEN)✅ Projet validé - prêt pour commit!$(NC)"

# === Rapports ===

report: ## Génération des rapports
	@echo "$(BLUE)📋 Génération des rapports...$(NC)"
	@npm run test:coverage
	@mkdir -p reports
	@echo "📊 Couverture: file://$(PWD)/coverage/lcov-report/index.html"

coverage: ## Ouvre le rapport de couverture
	@echo "$(BLUE)📊 Ouverture du rapport de couverture...$(NC)"
	@npm run test:coverage
	@if command -v open >/dev/null 2>&1; then \
		open coverage/lcov-report/index.html; \
	elif command -v xdg-open >/dev/null 2>&1; then \
		xdg-open coverage/lcov-report/index.html; \
	else \
		echo "Ouvrez manuellement: file://$(PWD)/coverage/lcov-report/index.html"; \
	fi

# === Maintenance ===

update: ## Mise à jour des dépendances
	@echo "$(BLUE)📦 Mise à jour des dépendances...$(NC)"
	@npm update
	@cargo update

audit: ## Audit de sécurité
	@echo "$(BLUE)🔒 Audit de sécurité...$(NC)"
	@npm audit
	@cargo audit 2>/dev/null || echo "$(YELLOW)⚠️  cargo-audit non installé$(NC)"

# === Profiling ===

profile: ## Profilage des performances
	@echo "$(BLUE)🔬 Profilage des performances...$(NC)"
	@npm run bench
	@echo "$(GREEN)📈 Profilage terminé$(NC)"

stress: ## Test de stress mémoire
	@echo "$(BLUE)💪 Test de stress...$(NC)"
	@node -e "console.log('🧠 Mémoire disponible:', Math.round(process.memoryUsage().heapTotal/1024/1024), 'MB')"
	@npm run bench
	@node -e "console.log('🧠 Mémoire après tests:', Math.round(process.memoryUsage().heapTotal/1024/1024), 'MB')"

# === Targets par défaut ===

all: clean build test bench ## Exécution complète
	@echo "$(GREEN)🎉 Tous les processus terminés!$(NC)"

# Target par défaut
.DEFAULT_GOAL := help

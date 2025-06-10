#!/bin/bash

# Script d'automatisation pour tests et benchmarks
set -e

# Couleurs pour l'affichage
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction d'affichage
print_section() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérifier les prérequis
check_prerequisites() {
    print_section "Vérification des prérequis"
    
    # Vérifier Rust et wasm-pack
    if ! command -v rustc &> /dev/null; then
        print_error "Rust n'est pas installé. Installez-le depuis https://rustup.rs/"
        exit 1
    fi
    
    if ! command -v wasm-pack &> /dev/null; then
        print_error "wasm-pack n'est pas installé. Installez-le avec: cargo install wasm-pack"
        exit 1
    fi
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        print_error "npm n'est pas installé"
        exit 1
    fi
    
    print_success "Tous les prérequis sont satisfaits"
    echo "  - Rust: $(rustc --version)"
    echo "  - wasm-pack: $(wasm-pack --version)"
    echo "  - Node.js: $(node --version)"
    echo "  - npm: $(npm --version)"
}

# Installation des dépendances
install_dependencies() {
    print_section "Installation des dépendances"
    
    if [ ! -d "node_modules" ]; then
        print_warning "Installation des dépendances npm..."
        npm install
    else
        print_success "Dépendances npm déjà installées"
    fi
}

# Build complet
build_project() {
    print_section "Build du projet"
    
    # Nettoyage
    print_warning "Nettoyage des fichiers précédents..."
    npm run clean
    
    # Build Rust/WASM
    print_warning "Compilation Rust vers WASM..."
    npm run build:rust
    
    # Build TypeScript
    print_warning "Compilation TypeScript..."
    npm run build:ts
    
    # Copie des fichiers WASM
    print_warning "Copie des fichiers WASM..."
    npm run copy:wasm
    
    print_success "Build terminé avec succès"
}

# Exécution des tests
run_tests() {
    print_section "Exécution des tests"
    
    # Tests de base
    print_warning "Tests unitaires de base..."
    npm run test:math
    
    # Tests étendus
    print_warning "Tests des opérations étendues..."
    npm run test:extended
    
    # Tests complets avec couverture
    print_warning "Tests complets avec couverture..."
    npm run test:coverage
    
    print_success "Tous les tests passent ✨"
}

# Exécution des benchmarks
run_benchmarks() {
    print_section "Exécution des benchmarks"
    
    print_warning "Benchmarks de performance..."
    print_warning "Cela peut prendre quelques minutes..."
    
    # Benchmarks rapides
    npm run perf:quick
    
    print_success "Benchmarks terminés"
}

# Génération du rapport
generate_report() {
    print_section "Génération du rapport"
    
    # Créer le répertoire reports s'il n'existe pas
    mkdir -p reports
    
    # Rapport de couverture
    if [ -d "coverage" ]; then
        print_success "Rapport de couverture disponible dans ./coverage/lcov-report/index.html"
    fi
    
    # Informations sur le build
    cat > reports/build-info.txt << EOF
Build Information
=================
Date: $(date)
Rust Version: $(rustc --version)
Node Version: $(node --version)
Package Version: $(node -p "require('./package.json').version")

Build Status: SUCCESS
Tests Status: PASSED
Benchmarks: COMPLETED

Files Generated:
- WASM Binary: $(ls -la pkg/*.wasm 2>/dev/null || echo "Not found")
- TypeScript Output: $(ls -la dist/*.js 2>/dev/null || echo "Not found")
- Type Definitions: $(ls -la dist/*.d.ts 2>/dev/null || echo "Not found")
EOF
    
    print_success "Rapport généré dans ./reports/build-info.txt"
}

# Nettoyage après échec
cleanup_on_error() {
    print_error "Erreur détectée. Nettoyage..."
    # Optionnel: nettoyer les fichiers temporaires
}

# Fonction principale
main() {
    echo -e "${GREEN}"
    echo "🚀 Quickly Library - Test & Benchmark Runner"
    echo "=============================================="
    echo -e "${NC}"
    
    # Trap pour nettoyer en cas d'erreur
    trap cleanup_on_error ERR
    
    # Mode rapide ou complet
    MODE=${1:-"full"}
    
    case $MODE in
        "quick")
            print_warning "Mode rapide activé"
            check_prerequisites
            install_dependencies
            build_project
            npm run test:math
            ;;
        "test-only")
            print_warning "Tests seulement"
            check_prerequisites
            install_dependencies
            build_project
            run_tests
            ;;
        "bench-only")
            print_warning "Benchmarks seulement"
            check_prerequisites
            install_dependencies
            build_project
            run_benchmarks
            ;;
        "full"|*)
            print_warning "Mode complet activé"
            check_prerequisites
            install_dependencies
            build_project
            run_tests
            run_benchmarks
            generate_report
            ;;
    esac
    
    echo -e "\n${GREEN}🎉 Processus terminé avec succès!${NC}"
    echo -e "${GREEN}📊 Consultez ./coverage/lcov-report/index.html pour la couverture${NC}"
    echo -e "${GREEN}📈 Les résultats de benchmarks sont affichés ci-dessus${NC}"
}

# Affichage de l'aide
if [[ $1 == "--help" || $1 == "-h" ]]; then
    echo "Usage: $0 [mode]"
    echo ""
    echo "Modes disponibles:"
    echo "  full       - Exécute tout (défaut)"
    echo "  quick      - Build + tests de base seulement"
    echo "  test-only  - Tests seulement"
    echo "  bench-only - Benchmarks seulement"
    echo ""
    echo "Exemples:"
    echo "  $0           # Mode complet"
    echo "  $0 quick     # Mode rapide"
    echo "  $0 test-only # Tests seulement"
    exit 0
fi

# Exécution
main $1

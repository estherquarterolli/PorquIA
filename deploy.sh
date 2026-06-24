#!/bin/bash

# 🚀 Script de Deploy do PorquIA para Firebase Hosting
# Uso: ./deploy.sh

set -e

echo "📦 PorquIA - Deploy para Firebase Hosting"
echo "=========================================="

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Verificar Firebase CLI
echo -e "\n${BLUE}1️⃣  Verificando Firebase CLI...${NC}"
if ! command -v firebase &> /dev/null; then
    echo -e "${YELLOW}Firebase CLI não encontrado. Instalando...${NC}"
    npm install -g firebase-tools
fi
echo -e "${GREEN}✓ Firebase CLI OK${NC}"

# 2. Build Frontend
echo -e "\n${BLUE}2️⃣  Fazendo build do frontend...${NC}"
cd frontend
npm run build
cd ..
echo -e "${GREEN}✓ Frontend build OK${NC}"

# 3. Verificar pasta out/
echo -e "\n${BLUE}3️⃣  Verificando pasta de saída...${NC}"
if [ -d "frontend/out" ]; then
    FILE_COUNT=$(find frontend/out -type f | wc -l)
    echo -e "${GREEN}✓ frontend/out encontrada (${FILE_COUNT} arquivos)${NC}"
else
    echo -e "${YELLOW}⚠️  frontend/out não existe!${NC}"
    exit 1
fi

# 4. Deploy
echo -e "\n${BLUE}4️⃣  Fazendo upload para Firebase...${NC}"
firebase deploy --only hosting

echo -e "\n${GREEN}✅ Deploy concluído!${NC}"
echo -e "\n${YELLOW}URLs:${NC}"
echo -e "  Frontend: ${BLUE}https://porquia-4ab2b.web.app${NC}"
echo -e "  Console:  ${BLUE}https://console.firebase.google.com/project/porquia-4ab2b${NC}"

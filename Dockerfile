# Use a imagem oficial do Node.js como base
FROM node:20-slim AS builder

# Instale ferramentas necessárias para compilar pacotes nativos
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários para o contêiner
COPY package.json package-lock.json ./

# Configure o limite de memória do Node.js
ENV NODE_OPTIONS=--max_old_space_size=512

# Atualize o npm para a versão mais recente
RUN npm install -g npm@11.3.0

# Instale as dependências
RUN npm install --legacy-peer-deps

# Remova dependências de desenvolvimento
RUN npm prune --production

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação Next.js
RUN npm run build

# Use uma imagem leve para servir a aplicação
FROM node:20-slim AS runner

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários do estágio de build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

# Configure o limite de memória do Node.js
ENV NODE_OPTIONS=--max_old_space_size=512

# Configure a variável de ambiente para produção
ENV NODE_ENV=production

# Exponha a porta que o Next.js usará
EXPOSE 80

# Comando para iniciar a aplicação
CMD ["npm", "run", "start", "--", "-p", "80"]
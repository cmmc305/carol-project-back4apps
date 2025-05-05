# Use a imagem oficial do Node.js como base
FROM node:18-alpine AS builder

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários para o contêiner
COPY package.json package-lock.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código da aplicação
COPY . .

# Construa a aplicação Next.js
RUN npm run build

# Use uma imagem leve para servir a aplicação
FROM node:18-alpine AS runner

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copie os arquivos necessários do estágio de build
COPY --from=builder /app/package.json /app/package-lock.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Instale apenas as dependências de produção
RUN npm install --production

# Exponha a porta que o Next.js usará
EXPOSE 80

# Comando para iniciar a aplicação
CMD ["npm", "start"]
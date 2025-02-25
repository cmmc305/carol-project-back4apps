# Etapa 1: Build
FROM node:18 AS builder

# Diretório de trabalho para o build
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm install

RUN npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core

RUN npm install styled-components

RUN npm install react-currency-input-field

RUN npm install express body-parser openai dotenv

RUN npm install pdfjs-dist@2.5.207

RUN npm install papaparse

# Copiar o restante do código do aplicativo
COPY . .

# Construir o aplicativo
RUN npm run build

# Etapa 2: Imagem final
FROM nginx:alpine

# Copiar arquivos construídos para o servidor NGINX
COPY --from=builder /app/build /usr/share/nginx/html

# Expor a porta 80 para o servidor
EXPOSE 80

# Comando padrão para iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]

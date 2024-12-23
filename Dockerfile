# Use uma imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install --force

# Instale o SDK do Parse
RUN npm install parse

# Copie o restante do código do aplicativo
COPY . .

# Construa o aplicativo
RUN npm run build

# Instale o servidor estático
RUN npm install -g serve

# Exponha a porta usada pela aplicação
EXPOSE 3000

# Inicie o servidor
CMD ["serve", "-s", "build", "-l", "3000"]

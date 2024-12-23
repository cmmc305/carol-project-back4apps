# Use uma imagem base
FROM node:18

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie os arquivos de dependências
COPY package*.json ./

# Instale as dependências com cache forçado para evitar erros de compatibilidade
RUN npm install --force

# Copie o restante do código do aplicativo
COPY . .

# Construa o aplicativo
RUN npm run build

# Instale o servidor estático
RUN npm install -g serve

# Exponha a porta do aplicativo
EXPOSE 3000

# Comando padrão para iniciar o servidor
CMD ["serve", "-s", "build", "-l", "3000"]

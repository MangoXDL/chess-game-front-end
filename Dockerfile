FROM node:22.20.0-alpine

# Use the requested npm version
RUN npm install -g npm@10.9.3

WORKDIR /app

# Copy dependency manifests first for better layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "start"]
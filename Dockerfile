FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package.json package-lock.json tsconfig.base.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
COPY shared shared
COPY server server

RUN npm ci

RUN npm run build -w shared
RUN npm run prisma:generate -w server
RUN npm run build -w server

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "server/dist/index.js"]

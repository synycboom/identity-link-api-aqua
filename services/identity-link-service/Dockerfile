# ------- BUILDER -------
FROM node:14-alpine AS builder

ENV NODE_ENV=production

WORKDIR /app

COPY . .

RUN npm i

RUN npm run build:release

RUN rm -rf node_modules

RUN npm i --only=production

# ------- RELEASE -------
FROM node:14-alpine AS release

ENV NODE_ENV=production

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules

COPY --from=builder /app/dist /app/dist

EXPOSE 8080

CMD ["node", "/app/dist/bundle.js"]

# JantaX — multi-stage Dockerfile
# Frontend (Vite) + Backend (Express) + Prisma

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# Backend build (server uses tsx, but we compile for prod)
RUN npm run server:build || echo "no server build output (tsc noEmit true, using tsx)"

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/package.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist
COPY --from=base /app/prisma ./prisma
COPY --from=base /app/server ./server
EXPOSE 4000 4173
CMD ["sh","-c","npx prisma migrate deploy && npm run preview -- --host 0.0.0.0 --port 4173 & node --loader tsx server/src/index.ts"]

# --- Stage 1: install dependencies ---------------------------------------
FROM node:24-alpine AS deps

WORKDIR /app

# Copy only the manifests first so this layer is cached until deps change
COPY package.json package-lock.json ./
RUN npm ci

# --- Stage 2: build the static bundle -------------------------------------
FROM node:24-alpine AS build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Vite inlines env vars at build time, so the API URL is baked into the bundle.
ARG VITE_API_URL=http://localhost:8000
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# --- Stage 3: serve ---------------------------------------------------------
FROM nginx:1.29-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

# nginx:alpine ships an unprivileged nginx user; 8080 keeps us off port 80.
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]

FROM node:20.13.1-alpine3.19 AS build
RUN npm i -g pnpm@8.5.1
WORKDIR /app/src
COPY package*.json ./
COPY pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . ./
RUN pnpm run build --configuration production

FROM nginxinc/nginx-unprivileged:mainline-alpine3.23-otel

COPY --chown=nginx:nginx --from=build /app/dist/*/browser /usr/share/nginx/html
USER nginx
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

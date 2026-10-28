FROM node:22-alpine AS build
RUN npm install --global pnpm@11.24.0
WORKDIR /repo
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=playground-web...

FROM caddy:2-alpine
COPY apps/playground-web/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /repo/apps/playground-web/storybook-static /srv
EXPOSE 8080

FROM node:18 as base
RUN apt update -y
RUN apt install -y git
WORKDIR /sisgea/env-dev/modules/backend-module-busca

FROM base as prod-deps
COPY package.json .npmrc package-lock.json ./
RUN npm install --omit=dev

FROM prod-deps as dev-deps
RUN npm install

FROM dev-deps as assets
COPY . .
RUN npm run build
RUN rm -rf node_modules

FROM prod-deps
COPY --from=assets /sisgea/env-dev/modules/backend-module-busca /sisgea/env-dev/modules/backend-module-busca
WORKDIR /sisgea/env-dev/modules/backend-module-busca
CMD npm run start:prod

FROM node:24-bullseye-slim

WORKDIR /app

COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

COPY tsconfig.json tsconfig.json
COPY src src
RUN yarn build

CMD ["yarn", "start"]
FROM node:20-alpine AS base

RUN apk add --no-cache tzdata

WORKDIR /usr/src/app

COPY [ "package.json", "package-lock.json*", "./" ]

FROM base AS development
ENV NODE_ENV=dev
RUN npm install
COPY . .
CMD [ "npm", "run", "start:dev" ]

FROM dev AS test
ENV NODE_ENV=test
CMD [ "npm", "run", "test" ]

FROM test AS test-cov
CMD [ "npm", "run", "test:cov" ]

FROM test AS test-watch
ENV GIT_WORK_TREE=/app GIT_DIR=/app/.git
RUN apk add git
CMD [ "npm", "run", "test:watch" ]

FROM base AS production
ENV NODE_ENV=production
RUN npm install husky -g
RUN npm install --production
RUN npm install -g @nestjs/cli
COPY . .
RUN npm run build
CMD [ "npm", "run", "start:prod" ]

# build source code
FROM alpine:3.10.0 AS builder

RUN apk add --update nodejs nodejs-npm

COPY ./src /home/node/app/src
COPY ./package.json /home/node/app/package.json
COPY ./nest-cli.json /home/node/app/nest-cli.json
COPY ./tsconfig.json /home/node/app/tsconfig.json
COPY ./tsconfig.build.json /home/node/app/tsconfig.build.json
COPY ./app.config.json /home/node/app/app.config.json

WORKDIR /home/node/app

RUN npm install
RUN npm run prestart:prod

# download only production dependency
FROM alpine:3.10.0 AS dependency

RUN apk add --update nodejs nodejs-npm

COPY ./package.json /home/node/app/package.json

WORKDIR /home/node/app

RUN npm install --production

# runtime
FROM alpine:3.10.0 as runtime

RUN apk add --update p7zip
RUN apk add --update nodejs

COPY --from=builder /home/node/app/dist /home/node/app/dist
COPY --from=dependency /home/node/app/node_modules /home/node/app/node_modules
COPY ./app.config.json /home/node/app/dist/app.config.json
COPY ./package.json /home/node/app/package.json

RUN mkdir /home/node/data

WORKDIR /home/node/app/dist

CMD node main.js
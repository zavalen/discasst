FROM node:16-alpine3.12

WORKDIR /discasst

COPY package.json /discasst

RUN mkdir /discasst/server

COPY server/package.json /discasst/server

RUN npm run install-all

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "dev" ]


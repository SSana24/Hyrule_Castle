FROM node:20
WORKDIR /app
RUN npm install -g typescript

COPY TheHyruleCastle/base_game/package.json .
RUN npm install

COPY TheHyruleCastle/ .
COPY ./*.json .
ENV  MODE=base_game
# RUN tsc main.ts

CMD [ "sh","-c", "node $MODE/main.js" ]
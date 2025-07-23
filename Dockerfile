FROM node:22-alpine

RUN mkdir -p /var/www/webkominfo/frontend
WORKDIR /var/www/webkominfo/frontend

COPY package*.json ./
RUN npm i -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 5020

ENV HOST=0.0.0.0

ENV PORT=5020

#CMD [ "pnpm", "preview" ]
CMD ["node", ".output/server/index.mjs"]

FROM node:alpine AS builder

WORKDIR /usr/app
COPY ./ ./

WORKDIR /usr/app/front-end
RUN npm install
RUN npm run build
RUN mv ./build/* ../back-end/public

WORKDIR /usr/app/back-end
RUN npm install
RUN npm run build

FROM node:alpine

COPY --from=builder /usr/app/back-end/dist ./dist
COPY --from=builder /usr/app/back-end/node_modules ./node_modules
COPY --from=builder /usr/app/back-end/assets ./assets
COPY --from=builder /usr/app/back-end/public ./public

CMD [ "node", "dist/apps/tiktok-sharer/main.js" ]

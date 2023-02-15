FROM node:16-alpine
WORKDIR /usr/app

COPY package.json .

RUN npm cache clean --force

RUN npm install --omit=dev
COPY . .

CMD ["npm", "start"]
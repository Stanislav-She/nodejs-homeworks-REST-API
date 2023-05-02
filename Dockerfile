FROM node:19.7.0-alpine

WORKDIR /home

COPY ./package*.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
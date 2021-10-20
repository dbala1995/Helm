FROM node:10
COPY package.json .
RUN npm install

WORKDIR /code

RUN npm install -g nodemon@1.19.1

COPY . /code

CMD ["npm", "start"]
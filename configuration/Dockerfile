FROM node:10

COPY package.json /code/package.json
RUN npm install 

WORKDIR /code
COPY . .

CMD ["npm", "run", "start"]
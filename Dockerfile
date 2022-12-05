FROM node:16

# Create app directory
WORKDIR /usr/src/koreni-api

# Install app dependecies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./

RUN npm install

# if you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 43156

CMD [ "node", "app.js" ]
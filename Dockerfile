#base image
FROM node:18-alpine

# set working directory
WORKDIR /app

# copy package.json and install dependencies
COPY package.json ./
RUN npm install
# copy the rest of the application code
COPY . .

# expose the port the app runs on
EXPOSE 3000

# start the application
CMD ["node", "app.js"]
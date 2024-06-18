# Use the official Node.js 18 image as the base image
FROM node:18

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Expose the port your application will listen on (usually 3000 for MERN)
EXPOSE 4200

# Define the command to run your application (directly start the server)
CMD [ "node", "server.js" ] 

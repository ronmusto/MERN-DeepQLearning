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

# Build your application
RUN npm run build 

# Expose the port your application will listen on
EXPOSE 4200

# Define the command to run your application
CMD [ "npm", "start" ] 

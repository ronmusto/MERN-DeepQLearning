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

# Use ARG to declare the environment variables during image build

ARG AtlasURI
ARG HOST
ARG JWT
ARG PORT

# Use ENV to set the environment variables inside the container

ENV AtlasURI=mongodb+srv://ronmusto:zbmgvQ6TUgiCrlk4@cluster0.i1tiquq.mongodb.net/MERN-Full-Stack-Data
ENV HOST=http://localhost:3000
ENV JWT=bre7YrEyzvGEnMhHfzpj$xqE&e2
ENV PORT=4200

# Expose the port your application will listen on (usually 3000 for MERN)
EXPOSE 4200

# Define the command to run your application (directly start the server)
CMD [ "node", "server.js" ] 

# Use a Node.js base image that comes with Python installed
FROM nikolaik/python-nodejs:python3.8-nodejs14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for Node.js dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy requirements.txt and install Python dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Rebuild bcrypt specifically in the final image
RUN npm rebuild bcrypt --build-from-source

# Expose the port the app runs on
EXPOSE 4200

# Command to run the application
CMD ["npm", "start"]

FROM node:16

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port defined in your .env or default to 8000
EXPOSE 8000

# Command to run the application
CMD ["npm", "start"]
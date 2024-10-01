# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy only the package.json and package-lock.json (or yarn.lock) first
# to leverage Docker caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Expose the port Next.js will run on
EXPOSE 3000

# Default command to run your Next.js app
CMD ["npm", "run", "start"]

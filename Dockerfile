# Use Node.js 20 Alpine as base image
FROM node:20-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json
COPY package.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build

# Use Node.js 20 Alpine as runtime image
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy the build artifacts from the build stage
COPY --from=build /app/dist/sales-scout ./dist/sales-scout

# Expose port 4000
EXPOSE 4000

# Start the server
CMD ["node", "dist/sales-scout/server/server.mjs"]

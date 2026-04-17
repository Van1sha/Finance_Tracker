# Stage 1: Build the React application
FROM node:18-alpine as build-stage
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the Vite application
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the previous stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80 to the docker environment
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

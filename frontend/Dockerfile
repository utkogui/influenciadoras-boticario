# Stage 1: Build the React application
FROM node:18-alpine AS build

# Receive the build argument and set it as an environment variable
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the application
# The VITE_API_URL should be set in the environment where the browser runs,
# not during the build. The frontend code should use this variable
# to connect to the backend. We will configure the code to use a relative
# path or an environment variable provided at runtime.
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:1.21.6-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 
# Docker file for web

# Use a specific version of node
FROM node:14.21.3 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN yarn add next@^9.1.7 && yarn run build

# Start a new stage from node 14.21.3
FROM node:14.21.3

WORKDIR /usr/src/app

# Copy over the built app from the previous stage
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["yarn", "run", "start"]

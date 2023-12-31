# Dockerfile for Server

# Use a specific version of node
FROM node:14 AS builder

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Set the registry
RUN echo "registry \"https://registry.yarnpkg.com\"" > .yarnrc

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Build the app
RUN yarn run build

# Start a new stage from node 14.15.4-alpine
FROM node:14

WORKDIR /usr/src/app

# Copy over the built app from the previous stage
COPY --from=builder /usr/src/app .

# Expose the port the app runs on
EXPOSE 4000

# Start the app
CMD ["yarn", "run", "start"]
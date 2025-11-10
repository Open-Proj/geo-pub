FROM node:22-alpine

WORKDIR /app

# Install dependencies (these will be overridden by volume mount if node_modules exists locally)
# The package.json and package-lock.json will be mounted from the host
COPY package*.json ./
RUN npm install

# Expose backend server port
EXPOSE 8000

# Start development server
CMD ["npm", "run", "dev"]

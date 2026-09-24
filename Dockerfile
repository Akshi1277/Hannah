FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source code
COPY . .

# Build the production static export into 'out'
RUN npm run build

# Install serve to host static files
RUN npm install -g serve

EXPOSE 3000

ENV NODE_ENV=production

# Serve the static export from 'out' directory on port 3000
CMD ["serve", "out", "-l", "3000"]

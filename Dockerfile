FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY src ./src
COPY schema ./schema
COPY sample-data ./sample-data

# Build TypeScript
RUN npm run build

# Expose application port
EXPOSE 3000

# Run database setup and start application
CMD npm run setup && npm start

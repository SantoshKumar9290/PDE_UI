# ------------------ Stage 1: Build ------------------
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Build Next.js application
RUN npm run build


# ------------------ Stage 2: Production ------------------
FROM node:18-alpine

WORKDIR /app

# Copy only Next.js build output
COPY --from=builder /app ./

# Expose the port Next.js runs on
EXPOSE 3000

# Start Next.js server
CMD ["npm", "run", "start"]

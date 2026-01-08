# ------------ Build Stage ------------
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ------------ Runtime Stage ------------
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start", "--", "-p", "3000"]

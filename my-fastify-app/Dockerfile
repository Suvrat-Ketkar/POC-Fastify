FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# OPTIONAL: Install bash only if needed
# RUN apk add --no-cache bash

# Remove any existing generated files and generate fresh for Linux
RUN rm -rf src/generated/prisma
RUN npx prisma generate

# Make sure wait-for-it.sh is executable
RUN chmod +x wait-for-it.sh

# Expose app port
EXPOSE 3000

# Use wait-for-it.sh in entrypoint, not as RUN step
CMD ["sh", "wait-for-it.sh", "db:5432", "--", "npm", "run", "dev"]

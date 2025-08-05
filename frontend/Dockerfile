FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install -g serve
EXPOSE 8000
CMD ["serve", "-s", ".", "-l", "8000"]

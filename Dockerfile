FROM node:22-alpine

WORKDIR /app

ENV PORT=4005

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p public/uploads

EXPOSE 4005

CMD ["npm", "start"]

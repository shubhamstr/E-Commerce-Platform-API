FROM node:22-alpine

WORKDIR /app

ENV PORT=5010

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p public/uploads

EXPOSE 5010

CMD ["npm", "start"]

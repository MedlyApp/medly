FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN yarn install --production --silent
COPY . .
EXPOSE 8081
CMD ["yarn", "dev"]

FROM node:18-alpine

#ARG port
#ENV PORT $port

WORKDIR /MessengerIntegrationService
COPY package*.json ./
RUN apk add --no-cache python3 make g++
RUN npm install

#COPY . .
#EXPOSE $port
CMD ["npm", "run", "dev"]
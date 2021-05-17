# Filename: Dockerfile 
FROM node:16-alpine
WORKDIR /home/nodejs/Project_test/EnzoVault_git/enzovault
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 3002
CMD ["npm" , "start"]
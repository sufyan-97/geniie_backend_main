FROM node:14
COPY . ./asaap_backend
WORKDIR ./asaap_backend
RUN npm install
EXPOSE 3000
CMD ["node" , "server.js"]

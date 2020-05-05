FROM node:10

RUN mkdir /node-workspace
COPY package.json /node-workspace 

WORKDIR /node-workspace

RUN npm ci

COPY . /node-workspace

VOLUME /node-workspace

RUN mkdir /test-results

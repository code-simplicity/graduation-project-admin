FROM node:15.9.0

ENV NODE_ENV=production

RUN mkdir -p /graduationProjectAdmin

COPY . /graduationProjectAdmin

WORKDIR /graduationProjectAdmin

RUN npm config set registry "https://registry.npm.taobao.org/" \
    && npm install --legacy-peer-deps

RUN npm install vite -g

EXPOSE 3333

CMD ["npm", "run", "dev"]
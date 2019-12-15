FROM node:alpine as builder
COPY . /shuhelper-frontend
WORKDIR /shuhelper-frontend
RUN rm -rf ./src/e2e
RUN npm install -g yarn && yarn && yarn build

FROM nginx:alpine
COPY --from=builder /shuhelper-frontend/dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx","-g daemon off;"]
EXPOSE 80

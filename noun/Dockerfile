FROM node:12-alpine

EXPOSE 8080
ENV HOME /home/node
USER node
COPY --chown=node:0 . /home/node/
WORKDIR /home/node
CMD ["npm", "start"]
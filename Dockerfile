FROM debian:bullseye as builder

ARG NODE_VERSION=16.14.0

RUN apt-get update; apt install -y curl
RUN curl https://get.volta.sh | bash
ENV VOLTA_HOME /root/.volta
ENV PATH /root/.volta/bin:$PATH
RUN volta install node@${NODE_VERSION}
RUN node -v

#######################################################################
USER root
# WORKDIR /client
# RUN npm install
# RUN npm run build

RUN mkdir /app
WORKDIR /app

# NPM will not install any package listed in "devDependencies" when NODE_ENV is set to "production",
# to install all modules: "npm install --production=false".
# Ref: https://docs.npmjs.com/cli/v9/commands/npm-install#description

ENV NODE_ENV production

COPY . .

WORKDIR /app


RUN npm install 
# WORKDIR /app/client
# RUN npm install
# RUN chmod -R 777 /usr/bin/env
# RUN chmod a+x /app

# RUN npm run build

WORKDIR /app

FROM debian:bullseye

LABEL fly_launch_runtime="nodejs"

COPY --from=builder /root/.volta /root/.volta
COPY --from=builder /app /app

WORKDIR /app
ENV NODE_ENV production
ENV PATH /root/.volta/bin:$PATH

CMD [ "npm", "run", "start" ]

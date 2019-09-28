FROM gitpod/workspace-full:latest

USER gitpod

# Install Bolt
RUN yarn global add "bolt@^0.23.4"

# Install LocalStack
ENV SERVICES "iam,lambda,apigateway,dynamodb"
RUN pip3 install localstack

# Download LocalStack dependencies
# RUN until localstack start | grep -m 1 "Ready."; do sleep 1; done

# Install Pulumi
ENV PATH "${PATH}:${HOME}/.pulumi/bin"
RUN curl -fsSL https://get.pulumi.com | sh && \
  # TODO: How can we automatically install correct version?
  pulumi plugin install resource aws v0.18.20

# Set up Pulumi
# RUN pulumi login file:///root/alg-wiki
# pulumi stack init local -C ./packages/backend/infrastructure # requires password entered

USER root
CMD "localstack" "start"


# FROM node:10

# WORKDIR /root/alg-wiki

# # Install Bolt
# RUN yarn global add "bolt@^0.23.4"

# # Install LocalStack
# ENV SERVICES "iam,lambda,apigateway,dynamodb"
# RUN apt-get update && apt-get install python3-dev default-jre -y && \
#   wget -O get-pip.py 'https://bootstrap.pypa.io/get-pip.py' && python3 get-pip.py && rm -f get-pip.py && \
#   pip3 install localstack

# # Download LocalStack dependencies
# # RUN until localstack start | grep -m 1 "Ready."; do sleep 1; done

# # Install Pulumi
# ENV PATH "/root/.pulumi/bin:${PATH}"
# RUN curl -fsSL https://get.pulumi.com | sh && \
#   # TODO: How can we automatically install correct version?
#   pulumi plugin install resource aws v0.18.20

# # Install Docker
# RUN curl -sSL https://get.docker.com/ | sh

# # Set up Pulumi
# RUN pulumi login file:///root/alg-wiki
# # pulumi stack init local -C ./packages/backend/infrastructure # requires password entered

# EXPOSE 11037

# CMD "localstack" "start"

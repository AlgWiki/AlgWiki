# Installs required dependencies nvm, Java and Python
FROM gitpod/workspace-full:latest

USER gitpod

# Install pnpm
RUN npm i -g pnpm@4

# Install LocalStack
ENV SERVICES "dynamodb"
RUN pip3 install localstack

# Download LocalStack dependencies
# RUN until localstack start | grep -m 1 "Ready."; do sleep 1; done

# Install Pulumi
# ENV PATH "${PATH}:${HOME}/.pulumi/bin"
# RUN curl -fsSL https://get.pulumi.com | sh && \
#   # TODO: How can we automatically install correct version?
#   pulumi plugin install resource aws v0.18.20

# Set up Pulumi
# RUN pulumi login file:///root/alg-wiki
# pulumi stack init local -C ./packages/backend/infrastructure # requires password entered

# Gitpod requires the final user to be root
USER root

CMD bash -e "cd /workspace/alg-wiki; pnpm run dev:localstack"

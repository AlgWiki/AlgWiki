FROM gitpod/workspace-full:latest

# Install Bolt
RUN yarn global add "bolt@^0.23.4"

# Install LocalStack
ENV SERVICES "iam,lambda,apigateway,dynamodb"
RUN pip3 install localstack

# Download LocalStack dependencies
# RUN until localstack start | grep -m 1 "Ready."; do sleep 1; done

# Install Pulumi
ENV PATH "/root/.pulumi/bin:${PATH}"
RUN curl -fsSL https://get.pulumi.com | sh && \
  # TODO: How can we automatically install correct version?
  pulumi plugin install resource aws v0.18.20

# Set up Pulumi
RUN pulumi login file:///root/alg-wiki
# pulumi stack init local -C ./packages/backend/infrastructure # requires password entered

CMD "localstack" "start"

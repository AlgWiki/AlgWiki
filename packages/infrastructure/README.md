### Prerequisites

- Pulumi
- Docker
- AWS CLI v2

### Dev

Setting up infra locally:

```sh
yarn workspace @alg-wiki/infrastructure localstack
yarn workspace @alg-wiki/infrastructure pulumi up
```

Viewing logs for a resource:

```sh
aws --endpoint-url=http://localhost:4566 logs describe-log-groups
aws --endpoint-url=http://localhost:4566 logs tail /aws/lambda/submit-solution-handler-19ee373 --follow
```

Setting up infra on AWS for dev:

```sh
# yarn workspace @alg-wiki/infrastructure pulumi stack init dev
yarn workspace @alg-wiki/infrastructure pulumi stack select dev
yarn workspace @alg-wiki/infrastructure pulumi up
```

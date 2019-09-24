import * as aws from '@pulumi/aws';

export type DeployEnvironment = 'local' | 'prod';

export const getProvider = (opts: { region: aws.Region; env: DeployEnvironment }) => {
  switch (opts.env) {
    case 'prod':
      return new aws.Provider('aws', { region: opts.region });

    case 'local':
      return new aws.Provider('localstack', {
        skipCredentialsValidation: true,
        skipMetadataApiCheck: true,
        s3ForcePathStyle: true,
        accessKey: 'mockAccessKey',
        secretKey: 'mockSecretKey',
        region: opts.region,
        endpoints: [
          {
            apigateway: 'http://localhost:4567',
            cloudwatchlogs: 'http://localhost:4586',
            dynamodb: 'http://localhost:4569',
            iam: 'http://localhost:4593',
            lambda: 'http://localhost:4574',
          },
        ],
      });

    default:
      throw new Error(`Unknown deployment environment: ${opts.env}`);
  }
};

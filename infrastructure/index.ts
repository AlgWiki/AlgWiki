import * as aws from '@pulumi/aws';
// import * as awsx from '@pulumi/awsx';
import { getProvider } from './provider';

const DEPLOY_ENV = 'local';
const REGION = 'us-east-1';

const NODE_RUNTIME = aws.lambda.NodeJS8d10Runtime;

const provider = getProvider({ region: REGION, env: DEPLOY_ENV });

// Doesn't work on LocalStack because the validation endpoints are not implemented
// https://github.com/spulec/moto/issues/2302
// const restApi = new awsx.apigateway.API(
//   'api',
//   {
//     routes: [
//       {
//         path: '/hello',
//         method: 'GET',
//         eventHandler: new aws.lambda.CallbackFunction(
//           'get-hello',
//           {
//             runtime: NODE_RUNTIME,
//             memorySize: 128,
//             async callback() {
//               return {
//                 statusCode: 200,
//                 body: 'Hello, API Gateway!',
//               };
//             },
//           },
//           { provider },
//         ),
//       },
//     ],
//   },
//   { provider },
// );

const createIamRole = () =>
  new aws.iam.Role(
    'lambda-role',
    {
      assumeRolePolicy: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'sts:AssumeRole',
            Principal: {
              Service: 'lambda.amazonaws.com',
            },
            Effect: 'Allow',
            Sid: '',
          },
          // {
          //   Effect: 'Allow',
          //   Action: 'logs:CreateLogGroup',
          //   Resource: 'arn:aws:logs:us-east-2:497605084935:*',
          // },
          // {
          //   Effect: 'Allow',
          //   Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
          //   Resource: ['arn:aws:logs:us-east-2:497605084935:log-group:/aws/lambda/hello-world:*'],
          // },
        ],
      },
    },
    { provider },
  );

const role = createIamRole();

const createIamRolePolicy = () =>
  new aws.iam.RolePolicyAttachment(
    'lambda-access',
    { role, policyArn: aws.iam.ManagedPolicies.AWSLambdaFullAccess },
    { provider },
  );

const fullAccess = createIamRolePolicy();

const createLambda = () =>
  new aws.lambda.CallbackFunction(
    'get-hello',
    {
      runtime: NODE_RUNTIME,
      memorySize: 128,
      timeout: 1,
      role,
      async callback() {
        return {
          statusCode: 200,
          body: 'Hello, API Gateway!',
        };
      },
    },
    { provider, dependsOn: fullAccess },
  );

const lambdaNode = createLambda();

const restApi = new aws.apigateway.RestApi('api', {}, { provider });

const resourceHello = new aws.apigateway.Resource(
  'api-resource-hello',
  { restApi, pathPart: 'hello', parentId: restApi.rootResourceId },
  { provider },
);

const method = new aws.apigateway.Method(
  'api-method',
  { restApi, resourceId: resourceHello.id, httpMethod: 'GET', authorization: 'NONE' },
  { provider },
);

const integration = new aws.apigateway.Integration(
  'api-integration',
  {
    restApi,
    resourceId: resourceHello.id,
    httpMethod: 'GET',
    type: 'AWS_PROXY',
    integrationHttpMethod: 'POST',
    passthroughBehavior: 'WHEN_NO_MATCH',
    uri: lambdaNode.arn.apply(
      arn =>
        arn && `arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${arn}/invocations`,
    ),
  },
  { dependsOn: [method], provider },
);

const deployment = new aws.apigateway.Deployment(
  'api-deployment',
  { restApi, stageName: DEPLOY_ENV },
  { dependsOn: integration, provider },
);

// Note: Lambda permission is only required when deploying to AWS cloud
if (DEPLOY_ENV !== 'local') {
  new aws.lambda.Permission(
    'api-lambda-permission',
    {
      action: 'lambda:invokeFunction',
      function: lambdaNode,
      principal: 'apigateway.amazonaws.com',
      sourceArn: deployment.executionArn.apply(arn => `${arn}*/*`),
    },
    { provider },
  );
}

export const apiUrl =
  DEPLOY_ENV === 'local'
    ? restApi.id.apply(id => `http://localhost:4567/restapis/${id}/${DEPLOY_ENV}/_user_request_/`)
    : deployment.invokeUrl;

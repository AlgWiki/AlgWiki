import pulumi from '@pulumi/pulumi';
import aws from '@pulumi/aws';
import awsx from '@pulumi/awsx';
import { getProvider } from './provider';

const DEPLOY_ENV = 'local';
const REGION = 'us-east-1';

const NODE_RUNTIME = aws.lambda.NodeJS8d10Runtime;

const provider = getProvider({ region: REGION, env: DEPLOY_ENV });

const createIamRole = () =>
  new aws.iam.Role(
    'lambda-role',
    {
      assumeRolePolicy: {
        Version: '2012-10-17',
        Statement: [
          // {
          //   Action: 'sts:AssumeRole',
          //   Principal: {
          //     Service: 'lambda.amazonaws.com',
          //   },
          //   Effect: 'Allow',
          //   Sid: '',
          // },
          {
            Effect: 'Allow',
            Action: 'logs:CreateLogGroup',
            Resource: 'arn:aws:logs:us-east-2:497605084935:*',
          },
          {
            Effect: 'Allow',
            Action: ['logs:CreateLogStream', 'logs:PutLogEvents'],
            Resource: ['arn:aws:logs:us-east-2:497605084935:log-group:/aws/lambda/hello-world:*'],
          },
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
  new aws.lambda.Function(
    'lambda-node',
    {
      runtime: NODE_RUNTIME,
      code: new pulumi.asset.FileArchive('./lambdas/hello-werld'),
      timeout: 1,
      handler: 'index.default',
      role: role.arn,
    },
    { provider, dependsOn: fullAccess },
  );

const lambdaNode = createLambda();

/////////////////////
// Setup APIGATEWAY
/////////////////////

// The following creates a REST API equivalent to the following Swagger specification:
//
//    {
//      swagger: "2.0",
//      info: { title: "localstack-demo-api", version: "1.0" },
//      paths: {
//        "/mypath": {
//          "x-amazon-apigateway-any-method": {
//            "x-amazon-apigateway-integration": {
//              uri: ,
//              passthroughBehavior: "when_no_match",
//              httpMethod: "POST",
//              type: "aws_proxy",
//            },
//          },
//        },
//      },
//    };

const restApi = new awsx.apigateway.API(
  'api',
  {
    routes: [
      {
        path: '/hello',
        method: 'GET',
        eventHandler: lambdaNode,
      },
    ],
  },
  { provider },
);

//////////////////////
// Create APIGATEWAY
//////////////////////

// let restApi = new aws.apigateway.RestApi(`${NAME}-api`, { body: '' }, { provider: awsProvider });

////////////////////////////
// Create RestApi Resource
////////////////////////////

// const resource = new aws.apigateway.Resource(
//   `${NAME}-api-resource`,
//   { restApi: restApi, pathPart: `${PATH}`, parentId: restApi.rootResourceId },
//   { provider: awsProvider },
// );

//////////////////////////
// Create RestAPI Method
//////////////////////////

// const method = new aws.apigateway.Method(
//   `${NAME}-api-method`,
//   { restApi: restApi, resourceId: resource.id, httpMethod: 'ANY', authorization: 'NONE' },
//   { provider: awsProvider },
// );

///////////////////////////////////
// Set RestApi Lambda Integration
///////////////////////////////////

// const integration = new aws.apigateway.Integration(
//   `${NAME}-api-integration`,
//   {
//     restApi: restApi,
//     resourceId: resource.id,
//     httpMethod: 'ANY',
//     type: 'AWS_PROXY',
//     integrationHttpMethod: 'POST',
//     passthroughBehavior: 'WHEN_NO_MATCH',
//     uri: lambdaNode.arn.apply(
//       arn =>
//         arn && `arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${arn}/invocations`,
//     ),
//   },
//   { dependsOn: [method], provider: awsProvider },
// );

///////////////////
// Deploy RestApi
///////////////////

// const deployment = new aws.apigateway.Deployment(
//   `${NAME}-api-deployment`,
//   { restApi: restApi, description: `${NAME} deployment`, stageName: DEPLOY_ENV },
//   { dependsOn: [integration], provider: awsProvider },
// );

////////////////////////////////////////
// Create Lambda APIGATEWAY Permission
////////////////////////////////////////

// Note: Lambda permission is only required when deploying to AWS cloud
// if (DEPLOY_ENV === 'prod') {
//   // Give permissions from API Gateway to invoke the Lambda
//   let invokePermission = new aws.lambda.Permission(
//     `${NAME}-api-lambda-permission`,
//     {
//       action: 'lambda:invokeFunction',
//       function: lambdaNode,
//       principal: 'apigateway.amazonaws.com',
//       sourceArn: deployment.executionArn.apply(arn => arn + '*/*'),
//     },
//     { provider },
//   );
// }

//////////////////////////////////
// Export RestApi https endpoint
//////////////////////////////////

// let endpoint;

// if (DEPLOY_ENV == 'prod') {
//   endpoint = deployment.invokeUrl.apply(url => url + `/${PATH}`);
// } else {
//   endpoint = restApi.id
//     .promise()
//     .then(() =>
//       restApi.id.apply(
//         id =>
//           `http://localhost:4567/restapis/${id}/${process.env.DEPLOY_ENV}/_user_request_/${PATH}`,
//       ),
//     );
// }

// exports.endpoint = endpoint;

export const endpoint = restApi.url;

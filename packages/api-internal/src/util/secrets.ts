import { SSM } from "aws-sdk";

export const requireSecret = async (paramName: string): Promise<string> => {
  const ssm = new SSM({});
  const { Parameter: parameter } = await ssm
    .getParameter({ Name: paramName, WithDecryption: true })
    .promise();
  if (!parameter) throw new Error(`Secret parameter ${paramName} not found`);
  const value = parameter.Value;
  if (!value) throw new Error(`Secret parameter ${paramName} is empty`);
  return value;
};

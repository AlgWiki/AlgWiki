import type { Output } from "@pulumi/pulumi";

import { api } from "./api";
import { dynamodb } from "./db";

export const apiUrl = api.url;
export const dbId = dynamodb.id as Output<string>;

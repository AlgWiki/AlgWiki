// This import must be first (before any resources are created)
import "./auto-tag";

import { apiInternal } from "./api-internal";
import { dynamodb } from "./db";

export const apiInternalUrl = apiInternal.url;
export const dbId = dynamodb.id;

import * as pulumi from "@pulumi/pulumi";

import { registerAutoTags } from "./util/tags";

registerAutoTags({ stack: pulumi.getStack() });

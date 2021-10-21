import * as pulumi from "@pulumi/pulumi";
import NetlifyAPI, { CreateDnsRecordBody } from "netlify";

import "./netlify-types";

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

type PulumiWrappedInput<T> = {
  [K in keyof T]: pulumi.Input<T[K]>;
};

interface DnsRecordArgsUnwrapped extends NetlifyAPI.CreateDnsRecordBody {
  accessToken: string;
  zoneId: string;
  secondsToWaitAfter?: number;
}
interface DnsRecordProps extends DnsRecordArgsUnwrapped {
  __provider: string;
}
export type DnsRecordArgs = PulumiWrappedInput<DnsRecordArgsUnwrapped>;
export class DnsRecord extends pulumi.dynamic.Resource {
  static provider: pulumi.dynamic.ResourceProvider = {
    async check(_olds: DnsRecordProps, news: DnsRecordProps) {
      return { inputs: news };
    },

    async create(props: DnsRecordProps) {
      const { __provider, zoneId, secondsToWaitAfter = 0, ...body } = props;
      const netlify = new NetlifyAPI(props.accessToken);
      try {
        const result = await netlify.createDnsRecord({
          zone_id: zoneId,
          body,
        });
        await sleep(secondsToWaitAfter);
        return { id: result.id, outs: props };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    async diff(_id, olds: DnsRecordProps, news: DnsRecordProps) {
      const keys: Set<keyof DnsRecordProps> = new Set([
        "accessToken",
        "zoneId",
        "type",
        "hostname",
        "value",
        "ttl",
        "priority",
        "weight",
        "port",
        "flag",
        "tag",
      ]);
      const replaces = Object.entries(news).flatMap(([key, value]) =>
        keys.has(key as keyof CreateDnsRecordBody) &&
        value !== olds[key as keyof CreateDnsRecordBody]
          ? [key]
          : []
      );
      return {
        changes:
          replaces.length > 0 ||
          Object.keys(olds).length !== Object.keys(news).length,
        replaces,
      };
    },

    async delete(id, props: DnsRecordProps) {
      const netlify = new NetlifyAPI(props.accessToken);
      await netlify.deleteDnsRecord({
        zone_id: props.zoneId,
        dns_record_id: id,
      });
    },

    async read(id, props: DnsRecordProps) {
      const netlify = new NetlifyAPI(props.accessToken);
      const { id: _id, ...output } = await netlify.getIndividualDnsRecord({
        zone_id: props.zoneId,
        dns_record_id: id,
      });
      return { id, props: { ...props, ...output } };
    },
  };

  constructor(
    name: string,
    props: DnsRecordArgs,
    opts?: pulumi.CustomResourceOptions
  ) {
    super(DnsRecord.provider, name, props, opts);
  }
}

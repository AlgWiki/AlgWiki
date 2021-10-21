declare module "netlify" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NetlifyAPI {
    export interface CreateDnsRecordBody {
      type: string;
      hostname: string;
      value: string;
      ttl?: number;
      priority?: number;
      weight?: number;
      port?: number;
      flag?: number;
      tag?: string;
    }
    export interface DnsRecordResult {
      id: string;
      hostname: string;
      type: string;
      value: string;
      ttl: number;
      priority: number;
      dns_zone_id: string;
      site_id: string;
      flag: number;
      tag: string;
      managed: boolean;
    }
  }
  class NetlifyAPI {
    constructor(accessToken: string);
    createDnsRecord(props: {
      zone_id: string;
      body: NetlifyAPI.CreateDnsRecordBody;
    }): Promise<NetlifyAPI.DnsRecordResult>;
    deleteDnsRecord(props: {
      zone_id: string;
      dns_record_id: string;
    }): Promise<void>;
    getIndividualDnsRecord(props: {
      zone_id: string;
      dns_record_id: string;
    }): Promise<NetlifyAPI.DnsRecordResult>;
  }
  export = NetlifyAPI;
}

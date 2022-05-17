export type FallbackAddress = {
  host: string;
  port: number;
  path?: string;
  proto: 'https' | 'tls' | 'udp';
};

export type FallbackAddress = {
  host: string;
  port: number;
  path?: string;
  proto: 'http' | 'https' | 'tls' | 'udp';
};

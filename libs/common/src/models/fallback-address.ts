export const FallbackProtocols = ['udp', 'tcp', 'tls', 'https', 'http'];

export type FallbackAddress = {
  host: string;
  port: number;
  path?: string;
  proto: 'http' | 'https' | 'tls' | 'tcp' | 'udp';
};

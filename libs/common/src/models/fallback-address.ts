export const FallbackProtocols = ['udp', 'tcp', 'tls', 'https', 'http'];

export type FallbackAddress = {
  host: string;
  port: number;
  proto: 'http' | 'https' | 'tls' | 'tcp' | 'udp';
};

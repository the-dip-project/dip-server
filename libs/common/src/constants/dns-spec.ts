/**
 * [QUERY_TYPE description]
 * @type {Object}
 * @docs https://tools.ietf.org/html/rfc1035#section-3.2.2
 */
export const TYPE = {
  A: 0x01,
  NS: 0x02,
  MD: 0x03,
  MF: 0x04,
  CNAME: 0x05,
  SOA: 0x06,
  MB: 0x07,
  MG: 0x08,
  MR: 0x09,
  NULL: 0x0a,
  WKS: 0x0b,
  PTR: 0x0c,
  HINFO: 0x0d,
  MINFO: 0x0e,
  MX: 0x0f,
  TXT: 0x10,
  AAAA: 0x1c,
  SRV: 0x21,
  EDNS: 0x29,
  SPF: 0x63,
  AXFR: 0xfc,
  MAILB: 0xfd,
  MAILA: 0xfe,
  ANY: 0xff,
  CAA: 0x101,
};
/**
 * [QUERY_CLASS description]
 * @type {Object}
 * @docs https://tools.ietf.org/html/rfc1035#section-3.2.4
 */
export const CLASS = {
  IN: 0x01,
  CS: 0x02,
  CH: 0x03,
  HS: 0x04,
  ANY: 0xff,
};
/**
 * [EDNS_OPTION_CODE description]
 * @type {Object}
 * @docs https://tools.ietf.org/html/rfc6891#section-6.1.2
 */
export const EDNS_OPTION_CODE = {
  ECS: 0x08,
};

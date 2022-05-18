import {
  sign as _sign,
  decode as _decode,
  verify as _verify,
  Secret,
  SignOptions,
  DecodeOptions,
  JwtHeader,
  VerifyOptions,
} from 'jsonwebtoken';

export type CompleteJwt<T> = {
  header: JwtHeader;
  payload: T;
  signature: string;
};

export function sign(
  payload: string | object | Buffer,
  secretOrPrivateKey: Secret,
  options?: SignOptions,
): Promise<string> {
  return new Promise((resolve, reject) => {
    function callback(err, token) {
      if (err) return reject(err);
      resolve(token);
    }

    _sign(payload, secretOrPrivateKey, options ?? {}, callback);
  });
}

export function decode<T>(
  token: string,
  decodeOptions?: DecodeOptions & { complete: boolean },
): Promise<T | CompleteJwt<T>> {
  return new Promise((resolve, reject) => {
    const decoded = _decode(token, decodeOptions);

    if (decoded === null) return reject(new Error('Invalid token'));

    if (decodeOptions?.complete) {
      const { header, payload, signature } = decoded as CompleteJwt<T>;
      resolve({ header, payload, signature });
    } else {
      resolve(decoded as unknown as T);
    }
  });
}

export function verify<T>(
  token: string,
  secretOrPublicKey: Secret,
  options?: VerifyOptions,
): Promise<T> {
  return new Promise((resolve, reject) => {
    function callback(err, payload) {
      if (err) return reject(err);
      resolve(payload as unknown as T);
    }

    _verify(token, secretOrPublicKey, options ?? {}, callback);
  });
}

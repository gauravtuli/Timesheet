declare module 'jsonwebtoken' {
  import { SignOptions, VerifyOptions } from 'crypto'

  export function sign(payload: string | Buffer | object, secretOrPrivateKey: string | Buffer, options?: SignOptions): string
  export function verify(token: string, secretOrPublicKey: string | Buffer, options?: VerifyOptions): string | object
  export function decode(token: string, options?: { complete?: boolean }): string | object | null
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import {
  Claim,
  MapOfKidToPublicKey,
  PublicKeys,
  TokenHeader,
} from '../auth/cognito.entity';
import * as axios from 'axios';
import jwkToPem from 'jwk-to-pem';
import { promisify } from 'util';
import * as jsonwebtoken from 'jsonwebtoken';

export const AUTHORIZED_USER_DATA = 'authorized-user-data';

@Injectable()
export class AuthorizationMiddleware implements NestMiddleware {
  cognitoPoolId = 'eu-west-2_9N6FWRG1v';
  cognitoIssuer = `https://cognito-idp.eu-west-2.amazonaws.com/${this.cognitoPoolId}`;
  cacheKeys: MapOfKidToPublicKey | undefined;

  getPublicKeys = async (): Promise<MapOfKidToPublicKey> => {
    if (!this.cacheKeys) {
      const url = `${this.cognitoIssuer}/.well-known/jwks.json`;
      const publicKeys = await axios.default.get<PublicKeys>(url);
      this.cacheKeys = publicKeys.data.keys.reduce((agg, current) => {
        const pem = jwkToPem(current);
        agg[current.kid] = { instance: current, pem };
        return agg;
      }, {} as MapOfKidToPublicKey);
      return this.cacheKeys;
    } else {
      return this.cacheKeys;
    }
  };

  verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

  async use(req: any, res: any, next: () => void) {
    const token = req.headers.authorization
      ? (req.headers.authorization as string).replace('Bearer ', '')
      : null;

    const tokenSections = (token || '').split('.');

    if (tokenSections.length > 1) {
      const headerJSON = Buffer.from(tokenSections[0], 'base64').toString(
        'utf8',
      );
      const header = JSON.parse(headerJSON) as TokenHeader;
      const keys = await this.getPublicKeys();
      const key = keys[header.kid];

      if (key === undefined) {
        throw new Error('claim made for unknown kid');
      }
      const claim = (await this.verifyPromised(token, key.pem)) as Claim;
      const currentSeconds = Math.floor(new Date().valueOf() / 1000);
      if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
        throw new Error('claim is expired or invalid');
      }
      if (claim.iss !== this.cognitoIssuer) {
        throw new Error('claim issuer is invalid');
      }
      if (claim.token_use !== 'access') {
        throw new Error('claim use is not access');
      }

      req[AUTHORIZED_USER_DATA] = {
        id: claim.sub,
        email: claim.username,
        roles: claim['cognito:groups'],
      };
    }

    next();
  }
}

import { Injectable, NestMiddleware } from '@nestjs/common';
import { TokenService } from '../service/token.service';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private tokenService: TokenService) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        throw new Error('unauthorized');
      }
      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        throw new Error('unauthorized');
      }
      const userData = this.tokenService.validateAccessToken(accessToken);
      if (!userData) {
        throw new Error('wrong access token');
      }

      req.user = userData;
      next();
    } catch (e) {
      console.error(e);
    }
  }
}

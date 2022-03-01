import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class IsNotAuth implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    return !request.user;
  }
}

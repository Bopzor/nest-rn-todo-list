import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { CryptoModule } from '../utils/crypto.module';
import { GeneratorModule } from '../utils/generator.module';

import { AuthenticationController } from './http/authentication.controller';
import { AuthenticationService } from './authentication.service';
import { AuthenticationResolver } from './graphql/authentication.resolver';

@Module({
  imports: [UserModule, CryptoModule, GeneratorModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticationResolver],
})
export class AuthenticationModule {}

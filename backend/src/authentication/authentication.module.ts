import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { CryptoModule } from '../utils/crypto.module';
import { GeneratorModule } from '../utils/generator.module';

import { AuthenticationController } from './controller/authentication.controller';
import { AuthenticationResolver } from './resolver/authentication.resolver';
import { AuthenticationService } from './service/authentication.service';

@Module({
  imports: [UserModule, CryptoModule, GeneratorModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, AuthenticationResolver],
})
export class AuthenticationModule {}

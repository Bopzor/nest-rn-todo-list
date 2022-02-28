import { Module } from '@nestjs/common';

import { UserModule } from '../user/user.module';
import { CryptoModule } from '../utils/crypto.module';
import { GeneratorModule } from '../utils/generator.module';

import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

@Module({
  imports: [UserModule, CryptoModule, GeneratorModule],
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
})
export class AuthenticationModule {}

import { ClassProvider, Module } from '@nestjs/common';

import { GeneratorPort } from './generator.port';
import { UUIDGeneratorAdapter } from './uuid-generator.adapter';

const generatorProvider: ClassProvider<GeneratorPort> = {
  provide: GeneratorPort,
  useClass: UUIDGeneratorAdapter,
};

@Module({
  providers: [generatorProvider],
  exports: [generatorProvider],
})
export class GeneratorModule {}

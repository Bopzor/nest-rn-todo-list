import { ClassProvider, Module } from '@nestjs/common';

import { StubGeneratorAdapter } from '../tests/stub-generator.adapter';

import { GeneratorPort } from './generator.port';
import { UUIDGeneratorAdapter } from './uuid-generator.adapter';

const generatorProvider: ClassProvider<GeneratorPort> = {
  provide: GeneratorPort,
  useClass: process.env.NODE_ENV !== 'test' ? UUIDGeneratorAdapter : StubGeneratorAdapter,
};

@Module({
  providers: [generatorProvider],
  exports: [generatorProvider],
})
export class GeneratorModule {}

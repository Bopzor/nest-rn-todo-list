import { ClassProvider, Module } from '@nestjs/common';

import { StubGeneratorAdapter } from 'src/tests/stub-generator.adapter';

import { GeneratorPort } from './generator.port';
import { GeneratorAdapter } from './generator.adapter';

const generatorProvider: ClassProvider<GeneratorPort> = {
  provide: GeneratorPort,
  useClass: process.env.NODE_ENV !== 'test' ? GeneratorAdapter : StubGeneratorAdapter,
};

@Module({
  providers: [generatorProvider],
  exports: [generatorProvider],
})
export class GeneratorModule {}

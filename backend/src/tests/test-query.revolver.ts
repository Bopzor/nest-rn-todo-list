import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ResolverForTest {
  @Query((returns) => String)
  sayHello(): string {
    return 'Hello World!';
  }
}

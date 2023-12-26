import { Field, ObjectType } from '@nestjs/graphql';
import { ISisgeaBuscaGenericSearchResult } from '@sisgea/spec';

@ObjectType('GenericSearchResult', { isAbstract: true })
export class GenericSearchResultType<T> implements ISisgeaBuscaGenericSearchResult<T> {
  @Field(() => String)
  query!: string;

  @Field(() => Number)
  limit!: number;

  @Field(() => Number)
  offset!: number;

  @Field(() => Number)
  total!: number;

  items!: T[];
}

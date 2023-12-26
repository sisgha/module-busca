import { Field, InputType, Int } from '@nestjs/graphql';
import { ISisgeaBuscaGenericListInput } from '@sisgea/spec';

@InputType('GenericListInput')
export class GenericListInputType implements ISisgeaBuscaGenericListInput {
  @Field(() => String, { nullable: true })
  query!: string;

  @Field(() => Int, { nullable: true })
  limit!: number;

  @Field(() => Int, { nullable: true })
  offset?: number;

  @Field(() => String, { nullable: true })
  filter?: string;

  @Field(() => [String], { nullable: true })
  sort?: string[];
}

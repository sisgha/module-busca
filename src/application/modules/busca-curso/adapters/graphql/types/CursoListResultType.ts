import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from '../../../../busca/graphql/GenericSearchResultType';
import { CursoType } from './CursoType';

@ObjectType('CursoListResult')
export class CursoListResultType extends GenericSearchResultType<CursoType> {
  @Field(() => [CursoType])
  items!: CursoType[];
}

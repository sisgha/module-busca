import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from '../../../_generics/graphql/generic-search-result.type';
import { UsuarioType } from './usuario.type';

@ObjectType('UsuarioListResult')
export class UsuarioListResultType extends GenericSearchResultType<UsuarioType> {
  @Field(() => [UsuarioType])
  items!: UsuarioType[];
}

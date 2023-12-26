import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from '../../../busca/graphql/GenericSearchResultType';
import { UsuarioType } from './usuario.type';

@ObjectType('UsuarioListResult')
export class UsuarioListResultType extends GenericSearchResultType<UsuarioType> {
  @Field(() => [UsuarioType])
  items!: UsuarioType[];
}

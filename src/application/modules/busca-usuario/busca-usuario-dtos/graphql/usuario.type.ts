import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { BuscaUsuarioModel } from '../../../../../domain';

@ObjectType('Usuario')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UsuarioType implements BuscaUsuarioModel {
  @Field(() => ID)
  id!: string;
}

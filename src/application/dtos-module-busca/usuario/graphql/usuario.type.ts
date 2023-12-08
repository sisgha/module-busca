import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { UsuarioModel } from '../../../../domain';

@ObjectType('Usuario')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UsuarioType implements UsuarioModel {
  @Field(() => ID)
  id!: string;
}

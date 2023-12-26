import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Usuario')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class UsuarioType {
  @Field(() => ID)
  id!: string;
}

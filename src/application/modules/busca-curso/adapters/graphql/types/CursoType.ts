import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { SisghaCursoModel } from '@sisgea/spec';

@ObjectType('Curso')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class CursoType implements Pick<SisghaCursoModel, 'id'> {
  @Field(() => ID)
  id!: string;
}

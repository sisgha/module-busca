import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { SisghaModalidadeModel } from '@sisgea/spec';

@ObjectType('Modalidade')
@Directive('@extends')
@Directive('@key(fields: "id")')
export class ModalidadeType implements Pick<SisghaModalidadeModel, 'id'> {
  @Field(() => ID)
  id!: string;
}

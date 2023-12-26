import { Field, ObjectType } from '@nestjs/graphql';
import { GenericSearchResultType } from '../../../../busca/graphql/GenericSearchResultType';
import { ModalidadeType } from './ModalidadeType';

@ObjectType('ModalidadeListResult')
export class ModalidadeListResultType extends GenericSearchResultType<ModalidadeType> {
  @Field(() => [ModalidadeType])
  items!: ModalidadeType[];
}

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PatientInformationsAccueil {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  nom?: string;

  @Field({ nullable: true })
  prenom?: string;

  @Field({ nullable: true })
  dateNaissance?: string;

  @Field({ nullable: true })
  sexe?: string;
}

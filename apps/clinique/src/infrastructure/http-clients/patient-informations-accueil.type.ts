import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

@ObjectType()
export class PatientInformationsAccueil {
  @Field({ nullable: true })
  @ApiProperty({ required: false })
  id?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  nom?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  prenom?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  dateNaissance?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  sexe?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  cin?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  profession?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  adresse?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  telephone?: string;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  contactUrgence?: string;

  @Field(() => Int, { nullable: true })
  @ApiProperty({ required: false, type: Number })
  priseEnChargeId?: number;

  @Field({ nullable: true })
  @ApiProperty({ required: false })
  createdBy?: string;
}

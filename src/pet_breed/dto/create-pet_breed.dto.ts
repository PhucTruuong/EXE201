import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreatePetBreedDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "alaska",
        example:"alaska",
        description:"name of dog breed exmaple : pug , phuc , alaska"
    })
    breed_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "dog is cute",
        example:"pug is angry",
        description:"describe about this breed pet"
    })
    breed_description: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "id of pet type",
    })
    pet_type_id: string;
}

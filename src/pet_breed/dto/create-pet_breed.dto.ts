import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class CreatePetBreedDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "dog",
    })
    breed_name: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "dog is cute",
    })
    breed_description: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "id of pet type",
    })
    pet_type_id: string;
}

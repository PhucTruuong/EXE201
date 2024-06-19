import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNotEmpty, IsNumber, IsString, IsUUID } from "class-validator";
export class CreatePetMobileDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "Hoàng Kim Nam",
        description: "name of pet"
    })
    pet_name: string;

    @IsNotEmpty()
    @IsDate()
    @ApiProperty({
        default: new Date(),
        description: "birthdate of pet"
    })
    pet_dob: Date;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 100,
        example: 100,
        description: "don vi cm"
    })
    height: number;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 67.5,
        example: 67.5,
        description: "weight  of pet"
    })
    weight: number;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "eba07116-3740-47d1-bac2-8dbf49325655",
        description: "id of pet type ( pet belongto type)"
    })
    pet_type_id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "b071c95b-e608-4342-bf5c-be50089c27e2",
        description: "id of pet breed ( pet belongs to pet breed)"
    })
    pet_breed_id: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        default: "string",
        example: "b071c95b-e608-4342-bf5c-be50089c27e2",
        description: "image"
    })
    image: string;
}

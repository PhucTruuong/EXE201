import { UploadedFile } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "hong phuc111",
        example: "hong phuc",
        description: "name of pet"
    })
    pet_name: string;

    @IsNotEmpty()
    @IsDateString()
    @ApiProperty({
        example: "2022-03-06T11:00:00.000Z",
        default: "2022-03-06T11:00:00.000Z",
        description: "birthdate of pet"
    })
    pet_dob: Date;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 100,
        example: 100,
        description: "don vi cm"
    })
    height: number

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: 67.5,
        example: 67.5,
        description: "weight  of pet"
    })
    weight: number
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "eba07116-3740-47d1-bac2-8dbf49325655",
        description: "id of pet type ( pet belongto type)"
    })
    pet_type_id: string
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example: "b071c95b-e608-4342-bf5c-be50089c27e2",
        description: "id of pet breed ( pet belongs to pet breed)"
    })
    pet_breed_id: string
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Image file of the pet'
    })
    image: Express.Multer.File;
}

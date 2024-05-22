import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "hong phuc",
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

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 100,
        example: 100,
        description: "don vi cm"
    })
    height: number
    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({
    //     default: "yellow",
    //     example:"red",
    //     description: "color overall of pet"
    // })
    // color: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 67.5,
        example: 67.5,
        description: "weight  of pet"
    })
    weight: number
    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({
    //     default: "uuid",
    //     example:"uuid",
    //     description: "id of user"
    // })
    // user_id: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example:"uuid",
        description: "id of pet type ( pet belongto type)"
    })
    pet_type_id: string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "string",
        example:"uuid",
        description: "id of pet breed ( pet belongs to pet breed)"
    })
    pet_breed_id: string
}

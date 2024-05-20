import { ApiProperty } from "@nestjs/swagger";
import {  IsDateString, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePetDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"hong phuc"
    })
    pet_name:string;

    @IsNotEmpty()
    @IsDateString()

    @ApiProperty({
        default:"2022-03-06T11:00:00.000Z"
    })
    pet_dob:Date;

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default:100,
        description:"don vi cm"
    })
    height : number
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"yellow",
        description:"color overall of pet"
    })
    color: string

    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default:67.5,
        description:"weight  of pet"
    })
    weight: number
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string",
        description:"id of user"
    })
    user_id :string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string",
        description:"id of pet type ( pet belongto type)"
    })
    pet_type_id  : string
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"string",
        description:"id of pet breed ( pet belongs to pet breed)"
    })
    pet_breed_id : string
}

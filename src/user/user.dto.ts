import {
    IsNumber,
    IsNotEmpty,
    Length,
    IsEmail,
    IsString,
    IsNumberString,
    IsOptional
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class UserPaginationDto {
    //@IsNotEmpty()
    @ApiProperty({
        default: 1,
        required: false
    })
    readonly page: number;

    //@IsNotEmpty()
    @ApiProperty({ 
        default: 10,
        required: false
    })
    readonly limit: number;
};

export class UserCreateDto {
    @IsNotEmpty()
    @Length(1, 50)
    @IsString()
    @ApiProperty({
        default: "",
    })
    readonly full_name: string;

    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        default: "",
    })
    readonly email: string;

    @IsNotEmpty()
    @IsNumberString()
    @Length(10, 12)
    @ApiProperty({
        default: ""
    })
    readonly phone_number: string;

    @IsNotEmpty()
    @Length(5, 20)
    @IsString()
    @ApiProperty({
        default: "",
    })
    readonly password: string;

    @IsNotEmpty()
    @Length(1, 20)
    @IsString()
    @ApiProperty({
        default: "customer",
    })
    readonly role_name: string;
}

export class UserModifiedDto {
    @IsNumber()
    @IsNotEmpty()
    @ApiProperty({
        default: 0,
    })
    readonly user_id: string;

    @Length(1, 50)
    @IsString()
    @IsOptional()
    @ApiProperty({
        default: "",
    })
    readonly full_name?: string;

    @IsEmail()
    @IsOptional()
    @ApiProperty({
        default: "",
    })
    readonly email?: string;

    @IsNumberString()
    @IsOptional()
    @Length(10, 12)
    @ApiProperty({
        default: "",
    })
    readonly phone_number?: string;
};
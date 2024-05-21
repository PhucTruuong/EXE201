import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        example: "nam@gmail.com",
        description:"Email for login"
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "123456",
    })
    password: string;
}

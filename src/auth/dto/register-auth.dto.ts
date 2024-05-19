import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsEmail, IsString } from "class-validator";

export class RegisterDto {
    
        
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "namVippro",
    })
    full_name: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({
        default: "nam@gmail.com",
    })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "123456",
    })

    password: string;
    @IsNotEmpty()
    @ApiProperty({
        default: "0123456789",
    })
    phone_number : string;
}

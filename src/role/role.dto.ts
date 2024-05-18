import { 
    IsNotEmpty, 
    Length,  
    IsString,
} from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class RoleDto {
    @IsNotEmpty()
    @ApiProperty()
    @ApiProperty({
        default: 0,
    })
    readonly role_id: number;

    @IsNotEmpty()
    @Length(1, 10)
    @IsString()
    @ApiProperty({
        default: "customer",
    })
    readonly role_name: string;
};

export class CreateRoleDto {
    @IsNotEmpty()
    @Length(1, 10)
    @ApiProperty({
        default: "customer",
    })
    readonly role_name: string;
}

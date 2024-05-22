import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateFeedbackDto {
    // @IsUUID()
    // @IsString()
    // @IsNotEmpty()
    // @ApiProperty({
    //     default:"uuid",
    //     example:"e0ccac27-5e9d-4027-93ec-cfb758cdd8b5",
    //     description:"user id who comment this feedback"
    // })
    // user_id:string;
    @IsUUID()
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"uuid",
        example:"e0ccac27-5e9d-4027-93ec-cfb758cdd8b5",
        description:"service which comment in  feedback"
    })
    service_id:string;

    @IsInt()
    @IsNotEmpty()
    @ApiProperty({
        default:5,
        example:5,
        description:"rating  must be int from 1 -5"
    })
    rating: number;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default:"This is the best services",
        example:"This is the best services",
        description:"Comment about service by user"
    })
    comment: string;
}

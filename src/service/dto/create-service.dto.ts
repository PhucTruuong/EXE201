import { ApiProperty } from "@nestjs/swagger";
import {  IsNotEmpty, IsString,  IsUUID } from "class-validator";

export class CreateServiceDto {
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default:"uuid",
        example:"jgfhn=432k=4253b-043343",
        description:"id of brand"
    })
    brand_id: string;
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default:"uuid",
        example:"jgfhn=432k=4253b-043343",
        description:"id of category"
    })
    category_id: string;
    @IsString()
    @IsNotEmpty()
    @IsUUID()
    @ApiProperty({
        default:"uuid",
        example:"jgfhn=432k=4253b-043343",
        description:"id of location"
    })
    location_id:  string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "service_name",
        example: "service_name",
        description: "Service namemust be string"
    })
    service_name: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "service_description",
        example: "service_description",
        description: "Service namemust be string"
    })
    service_description: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "2024-05-22T10:00:00+00:00",
        example: "2024-05-22T10:00:00+00:00",
        description: "Start time of the service in ISO 8601 format with time zone"
    })
    startTime: string;
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        default: "2024-05-22T10:00:00+00:00",
        example: "2024-05-22T10:00:00+00:00",
        description: "Start time of the service in ISO 8601 format with time zone"
    })
    endTime: string;


}

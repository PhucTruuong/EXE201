import { ApiProperty } from "@nestjs/swagger";
import {
    IsDate,
    IsNotEmpty,
    IsString,
    IsUUID,
    Matches
} from "class-validator";

const timeRegex = /^([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
export class CreateAppointmentDto {
    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "0685bcdd-8332-43f7-bcec-118fd9091c7c",
        description: "id of pet"
    })
    pet_id: string;

    @IsUUID()
    @IsNotEmpty()
    @ApiProperty({
        default: "1b1de1e7-0be2-4365-ba3e-2d85e5aaf716",
        description: "id of service"
    })
    service_id: string;

    @IsDate()
    @IsNotEmpty()
    @ApiProperty({
        default: new Date().toISOString(),
        description: "date"
    })
    appointment_date: Date;

    @IsString()
    @IsNotEmpty()
    @Matches(
        timeRegex,
        { message: 'appointment_time must be in HH:mm:ss format' }
    )
    @ApiProperty({
        default: "14:00:00",
        description: "time"
    })
    appointment_time: string;
};

import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsString, IsUUID } from "class-validator";

export class CreateAppointmentDto {
@IsUUID()
@IsNotEmpty()
@ApiProperty({
    default:"uuid",
    example:"uuid",
    description:"id of pet"
})

pet_id: string;
@IsUUID()
@IsNotEmpty()
@ApiProperty({
    default:"uuid",
    example:"uuid",
    description:"id of service"
})
service_id: string;
@IsDateString()
@IsNotEmpty()
@ApiProperty({
    default:"date",
    example:"date",
    description:"date"
})
appointment_date: Date;
@IsString()
@IsNotEmpty()
@ApiProperty({
    default:"time",
    example:"time",
    description:"time"
})
appointment_time: string;

}

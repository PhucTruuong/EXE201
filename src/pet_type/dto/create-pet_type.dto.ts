import { IsNotEmpty, IsString } from "class-validator";

export class CreatePetTypeDto {
    @IsString()
    @IsNotEmpty()
    type_name:string;
    @IsString()
    @IsNotEmpty()
    type_description:string;
}

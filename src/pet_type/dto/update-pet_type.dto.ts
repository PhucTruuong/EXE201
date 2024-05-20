import { IsNotEmpty, IsString } from 'class-validator';


export class UpdatePetTypeDto {
    // @IsString()
    // @IsNotEmpty()
    // id:string;
    @IsString()
    @IsNotEmpty()
    type_name:string;
    @IsString()
    @IsNotEmpty()
    type_description:string;
}

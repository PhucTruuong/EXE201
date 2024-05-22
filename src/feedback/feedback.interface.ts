import { ConflictException, HttpException, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { FeedBackPagination } from "./dto/pagination-feedback.dto";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { RequestWithUser } from "src/interface/request-interface";

export interface IFeedBack {
    find(pagination: FeedBackPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException>;
    create(createFeedbackDto : CreateFeedbackDto , req: RequestWithUser): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOne(id: string):Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    update(id: string,updateFeedbackDto: UpdateFeedbackDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>
    delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> 
}
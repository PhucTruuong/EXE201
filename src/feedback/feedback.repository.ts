import { ConflictException, HttpException, Inject, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { IFeedBack } from "./feedback.interface";
import { Feedback } from "src/database/dabaseModels/feedbacks.entity";
import { User } from "src/database/dabaseModels/user.entity";
import { Service } from "src/database/dabaseModels/service.entity";
import { CreateFeedbackDto } from "./dto/create-feedback.dto";
import { FeedBackPagination } from "./dto/pagination-feedback.dto";
import { UpdateFeedbackDto } from "./dto/update-feedback.dto";
import { UserRepository } from "src/user/user.repository";
import { Op } from "sequelize";
import { RequestWithUser } from "src/interface/request-interface";

export class feedbackRepository implements IFeedBack {
    constructor(
        @Inject('FEEDBACK_REPOSITORY')
        private readonly feedBackModel: typeof Feedback,
        @Inject('USER_REPOSITORY')
        private readonly userModel: typeof User,
        @Inject('SERVICE_REPOSITORY')
        private readonly serviceModel: typeof Service,
        private readonly userRepository: UserRepository,

    ) { }
    async create(createFeedbackDto: CreateFeedbackDto,req:RequestWithUser): Promise<object | InternalServerErrorException | NotFoundException | HttpException | ConflictException> {
        try {
            const existUser = await this.userModel.findOne({
                where: { user_id: req.user.userId }
            })
            if (!existUser) {
                throw new NotFoundException('User not found')
            }
            const existService = await this.serviceModel.findOne({
                where: { id: createFeedbackDto.service_id }
            })
            if (!existService) {
                throw new NotFoundException('Service not found')
            }
            
            const new_item = await this.feedBackModel.create({
                user_id:req.user.userId,
                service_id: createFeedbackDto.service_id,
                comment: createFeedbackDto.comment,
                rating: createFeedbackDto.rating,
            })
            return new_item
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error create feedback", error)

        }
    }
    async delete(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.feedBackModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            await this.feedBackModel.destroy({
                where: { id: id }
            })
            return {
                message: "item deleted successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one item ", error)
        };

    }
    async find(pagination: FeedBackPagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | NotFoundException> {
        try {
            const { count, rows: allItem } = await this.feedBackModel.findAndCountAll({
                attributes: [
                    'id',
                    'comment',
                    'rating',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                include: [
                    {
                        model: this.serviceModel,
                        as: 'service',
                    },
                    {
                        model: this.userModel,
                        as: 'user',
                    },

                ]
            });
            if (!allItem || count === 0) {
                return new NotFoundException()
            } else {
                return {
                    data: allItem,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching  ", error)
        };
    }
    async findOne(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const item = await this.feedBackModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            return item
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find item ", error)
        };
    }
    async update(id: string, updateFeedbackDto: UpdateFeedbackDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const item = await this.feedBackModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            const duplicateName = await this.feedBackModel.findOne({
                where: {
                    [Op.and]: [
                        {
                            comment: updateFeedbackDto.comment,
                        },
                        {
                            rating: updateFeedbackDto.rating
                        }
                    ]
                }
            })
            if (duplicateName) {
                throw new ConflictException("You are not update anything");
            }
            const updated = await this.serviceModel.update(
                {
                    comment: updateFeedbackDto.comment,
                    rating: updateFeedbackDto.rating,
                    updateAt: new Date(),
                },
                {
                    where: { id: id }
                }
            )
            return updated
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error update item ", error)
        };
    }
}
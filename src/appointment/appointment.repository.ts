import { InternalServerErrorException, NotFoundException, HttpException, ConflictException, Inject } from "@nestjs/common";
import { IAppointment } from "./appointment.interface";
import { CreateAppointmentDto } from "./dto/create-appointment.dto";
import { Appointment } from "src/database/dabaseModels/appointment.entity";
import { AppointmentPagination } from "./dto/pagination-appointment.dto";
import { UpdateAppointmentDto } from "./dto/update-appointment.dto";
import { Pet } from "src/database/dabaseModels/pet.entity";
import { Service } from "src/database/dabaseModels/service.entity";
import { RequestWithUser } from "src/interface/request-interface";

export class AppointmentRepository implements IAppointment {
    constructor(
        @Inject('APPOINTMENT_REPOSITORY')
        private readonly appointmentModel: typeof Appointment,
        @Inject('PET_REPOSITORY')
        private readonly petModel: typeof Pet,
        @Inject('SERVICE_REPOSITORY')
        private readonly serviceModel: typeof Service,
    ) { }
    async create(createAppointmentDto: CreateAppointmentDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException | ConflictException> {
        try {
            const existPet = await this.petModel.findOne({
                where: { id: createAppointmentDto.pet_id }

            })
            if (!existPet) {
                return new NotFoundException('Pet Not Found')
            }
            const existService = await this.serviceModel.findOne({
                where: { id: createAppointmentDto.service_id }

            })
            if (!existService) {
                return new NotFoundException('Service  Not Found')
            }
            const appointment = await this.appointmentModel.create({
                pet_id: createAppointmentDto.pet_id,
                service_id: createAppointmentDto.service_id,
                appointment_date: createAppointmentDto.appointment_date,
                appointment_time: createAppointmentDto.appointment_time
            })
            return appointment;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error create appointment", error)
        }

    }
    async find(pagination: AppointmentPagination): Promise<{ data: object[]; totalCount: number; } | InternalServerErrorException | NotFoundException> {
        try {
            const { count, rows: allItem } = await this.appointmentModel.findAndCountAll({
                attributes: [
                    'id',
                    'appointment_date',
                    'appointment_time',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit,
                include: [
                    {
                        model: this.petModel,
                        as: 'pet',
                    },
                    {
                        model: this.serviceModel,
                        as: 'service',
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
            const item = await this.appointmentModel.findOne({
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
    async findByUser(req: RequestWithUser): Promise<object | InternalServerErrorException | NotFoundException> {
        try {
            // find all pet that user have
            const pets = await this.petModel.findAll({
                where: { user_id: req.user.userId }

            })
            console.log("pets fopund" , pets)
            if (!pets || pets.length === 0) {
                return new NotFoundException("User not found")

            }
            const petIds = pets.map(pet => pet.id);
            console.log("petIds" , petIds)
            const appointments = await this.appointmentModel.findAll({
                where: { pet_id: petIds }
            })
            if(!appointments){
                return new NotFoundException("Not have any appointments");
            }
            return appointments;
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find appointment ", error)

        }

    }
    async update(id: string, updateAppointmentDto: UpdateAppointmentDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const item = await this.appointmentModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            const updated = await this.serviceModel.update(
                {
                    pet_id: updateAppointmentDto.pet_id,
                    service_id: updateAppointmentDto.service_id,
                    appointment_date: updateAppointmentDto.appointment_date,
                    appointment_time: updateAppointmentDto.appointment_time,
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
    async delete(id: string): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const item = await this.appointmentModel.findOne({
                where: { id: id }
            })
            if (!item) {
                throw new NotFoundException("item  not found");
            }
            await this.appointmentModel.destroy({
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
}
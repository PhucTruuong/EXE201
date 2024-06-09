import {
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  ConflictException,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { IService } from './service.interface';
import { Service } from 'src/database/dabaseModels/service.entity';
import { Brand } from 'src/database/dabaseModels/brand.entity';
import { Category } from 'src/database/dabaseModels/category.entity';
import { ServicePagination } from './dto/pagination-service';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Location } from 'src/database/dabaseModels/location.entity';
import { RequestWithUser } from 'src/interface/request-interface';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

export class ServiceRepository implements IService {
  constructor(
    @Inject('SERVICE_REPOSITORY')
    private readonly serviceModel: typeof Service,
    @Inject('LOCATION_REPOSITORY')
    private readonly locationModel: typeof Location,
    @Inject('BRAND_REPOSITORY')
    private readonly brandModel: typeof Brand,
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryModel: typeof Category,
    private readonly cloudinaryService: CloudinaryService,
  ) { }

  public async create(
    createServiceDto: CreateServiceDto & { image: Express.Multer.File },
    req: RequestWithUser,
  ): Promise<
    | object
    | InternalServerErrorException
    | HttpException
    | ConflictException
    | NotFoundException
  > {
    console.log('createServiceDto', createServiceDto);
    try {
      const promises = [
        this.serviceModel.findOne({
          where: {
            service_name: createServiceDto.service_name,
          },
        }),

        this.brandModel.findOne({
          where: {
            id: createServiceDto.brand_id,
          },
        }),

        this.locationModel.findOne({
          where: {
            id: createServiceDto.location_id,
          },
        }),

        this.categoryModel.findOne({
          where: {
            id: createServiceDto.category_id,
          },
        })
      ];

      const [existing, existingBrand, existingLocation, existingCategory] = await Promise.all(promises);

      if (existing) {
        return new ConflictException(
          'Items already exists , choose other name',
        );
      };

      if (!existingBrand) {
        return new NotFoundException('Brand not found');
      };

      if (!existingLocation) {
        return new NotFoundException('Item not found');
      };

      if (!existingCategory) {
        return new NotFoundException('Category not found ');
      };

      let imageUrl = null;
      if (createServiceDto.image) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createServiceDto.image,
          );

          if (!uploadResult) {
            console.log('error upload image pet');
            return new InternalServerErrorException();
          };

          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.log('error from upload', error);
          return new InternalServerErrorException(error.message);
        };
      } else {
        return new NotFoundException('There is no image');
      };

      const new_item = await this.serviceModel.create({
        service_name: createServiceDto.service_name,
        service_description: createServiceDto.service_description,
        price: createServiceDto.service_price,
        starttime: createServiceDto.startTime,
        endtime: createServiceDto.endTime,
        brand_id: createServiceDto.brand_id,
        category_id: createServiceDto.category_id,
        location_id: createServiceDto.location_id,
        user_id: req.user.userId,
        image: imageUrl,
        createAt: new Date(),
        updateAt: new Date(),
      });

      return new_item;
    } catch (error) {
      console.log('error', error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async find(
    pagination: ServicePagination,
  ): Promise<
    | { data: object[]; totalCount: number }
    | InternalServerErrorException
    | NotFoundException
    | BadRequestException
  > {
    try {
      if (pagination.limit === undefined && pagination.page === undefined) {
        const allItem = await this.serviceModel.findAll({
          attributes: [
            'id',
            'service_name',
            'service_description',
            'starttime',
            'endtime',
            'price',
            'image',
            'status',
            'created_at',
            'updated_at',
          ],
          include: [
            {
              model: Brand,
              as: 'brand',
              attributes: ['id', 'brand_name', 'brand_description', 'image'],
            },
            {
              model: Location,
              as: 'location',
              attributes: ['id', 'location_name', 'location_address'],
            },
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'category_name', 'category_description', 'image'],
            },
          ],
        });
        if (!allItem) {
          return new NotFoundException();
        } else {
          return {
            data: allItem,
            totalCount: 1,
          };
        }
      };

      if (
        (pagination.limit === undefined && pagination.page) ||
        (pagination.limit && pagination.page === undefined)
      ) {
        return new BadRequestException('Please provide page and limit!');
      };

      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;
      const findOptions: any = {
        attributes: [
          'id',
          'service_name',
          'service_description',
          'starttime',
          'endtime',
          'image',
          'status',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'brand_name', 'brand_description', 'image'],
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'location_name', 'location_address'],
          },
          {
            model: Category,
            as: 'category',
            attributes: ['id', 'category_name', 'category_description', 'image'],
          },
        ],
      };

      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      }
      const { count, rows: allItem } = await this.serviceModel.findAndCountAll(findOptions);

      const numberOfPage = Math.ceil(count / pagination.limit);

      if (!allItem || count === 0) {
        return new NotFoundException();
      } else {
        return {
          data: allItem,
          totalCount: numberOfPage,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async findOne(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const item = await this.serviceModel.findOne({
        where: { id: id },
        attributes: [
          'id',
          'service_name',
          'service_description',
          'starttime',
          'endtime',
          'image',
          'price',
          'status',
          'created_at',
          'updated_at',
        ],
        include: [
          {
            model: Brand,
            as: 'brand',
            attributes: ['id', 'brand_name', 'brand_description', 'image'],
          },
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'location_name', 'location_address'],
          },
          {
            model: Category,
            as: 'category',
            attributes: [
              'id',
              'category_name',
              'category_description',
              'image',
            ],
          },
        ],
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      return item;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error find item ', error);
    };
  };

  public async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
    try {
      const existedService = await this.serviceModel.findOne({
        where: { id: id },
      });

      if (!existedService) {
        return new NotFoundException('Service not found');
      }

      if (
        !updateServiceDto.service_name &&
        !updateServiceDto.service_description &&
        !updateServiceDto.startTime &&
        !updateServiceDto.endTime &&
        !updateServiceDto.brand_id &&
        !updateServiceDto.category_id &&
        !updateServiceDto.location_id
      ) {
        return new BadRequestException('Please provide data to update');
      }

      const updateObject = {};

      if (updateServiceDto.service_name) {
        const duplicateName = await this.serviceModel.findOne({
          where: { service_name: updateServiceDto.service_name },
        });
        if (duplicateName) {
          throw new ConflictException('Duplicate name!');
        }
        updateObject['service_name'] = updateServiceDto.service_name;
      };

      if (updateServiceDto.brand_id) {
        const existedBrand = await this.brandModel.findOne({
          where: { id: updateServiceDto.brand_id },
        });
        if (!existedBrand) {
          throw new NotFoundException('Brand not found');
        }
        updateObject['brand_id'] = updateServiceDto.brand_id;
      };

      if (updateServiceDto.category_id) {
        const existedCategory = await this.categoryModel.findOne({
          where: { id: updateServiceDto.category_id },
        });
        if (!existedCategory) {
          throw new NotFoundException('Category not found');
        }
        updateObject['category_id'] = updateServiceDto.category_id;
      };

      if (updateServiceDto.location_id) {
        const existedLocation = await this.locationModel.findOne({
          where: { id: updateServiceDto.location_id },
        });
        if (!existedLocation) {
          throw new NotFoundException('Location not found');
        }
        updateObject['location_id'] = updateServiceDto.location_id;
      };

      if (updateServiceDto.service_description) {
        updateObject['service_description'] = updateServiceDto.service_description;
      };

      if (updateServiceDto.startTime) {
        updateObject['starttime'] = updateServiceDto.startTime;
      };

      if (updateServiceDto.endTime) {
        updateObject['endtime'] = updateServiceDto.endTime;
      };

      updateObject['updatedAt'] = new Date();

      await this.serviceModel.update(updateObject, {
        where: { id: id },
      });

      return { message: 'Service updated successfully' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    };
  };

  public async delete(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const item = await this.serviceModel.findOne({
        where: { id: id },
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      await this.serviceModel.destroy({
        where: { id: id },
      });
      return {
        message: 'item deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error delete one item ', error);
    };
  };
};

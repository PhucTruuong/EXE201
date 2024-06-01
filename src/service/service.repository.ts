import {
  InternalServerErrorException,
  NotFoundException,
  HttpException,
  ConflictException,
  Inject,
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
  ) {}

  async create(
    createServiceDto: CreateServiceDto & { image: Express.Multer.File },
    req: RequestWithUser,
  ): Promise<
    | object
    | InternalServerErrorException
    | HttpException
    | ConflictException
    | NotFoundException
  > {
    try {
      const existing = await this.serviceModel.findOne({
        where: {
          service_name: createServiceDto.service_name,
        },
      });
      if (existing) {
        return new ConflictException(
          'Items already exists , choose other name',
        );
      }
      const existingBrand = await this.brandModel.findOne({
        where: {
          id: createServiceDto.brand_id,
        },
      });
      if (!existingBrand) {
        return new NotFoundException('Brand not found ');
      }
      const existingLocation = await this.locationModel.findOne({
        where: {
          id: createServiceDto.location_id,
        },
      });
      if (!existingLocation) {
        return new NotFoundException('item not found ');
      }
      const existingCategory = await this.categoryModel.findOne({
        where: {
          id: createServiceDto.category_id,
        },
      });
      if (!existingCategory) {
        return new NotFoundException('Category not found ');
      }

      let imageUrl = null;
      if (createServiceDto.image) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createServiceDto.image,
          );
          if (!uploadResult) {
            console.log('error upload image pet');
            return new InternalServerErrorException();
          }
          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.log('error from upload', error);
          return new InternalServerErrorException();
        }
      } else {
        return new NotFoundException('not have images');
      }
      const new_item = await this.serviceModel.create({
        service_name: createServiceDto.service_name,
        service_description: createServiceDto.service_description,
        startTime: createServiceDto.startTime,
        endTime: createServiceDto.endTime,
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
      throw new InternalServerErrorException('Error create item', error);
    }
  }
  async find(
    pagination: ServicePagination,
  ): Promise<
    | { data: object[]; totalCount: number }
    | InternalServerErrorException
    | NotFoundException
  > {
    try {
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
              attributes: ['id', 'brand_name','brand_description','image'],
            },
            {
              model: Location,
              as: 'location',
              attributes: ['id', 'location_name', 'location_address'],
            },
            {
              model: Category,
              as: 'category',
              attributes: ['id', 'category_name','category_description','image'],
            },
          ],
      }
       if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      }
      const { count, rows: allItem } = await this.serviceModel.findAndCountAll(findOptions);
      
      if (!allItem || count === 0) {
        return new NotFoundException();
      } else {
        return {
          data: allItem,
          totalCount: count,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error fetching services ', error);
    }
  }
  async findOne(
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
          // 'brand_id',
          // 'location_id',
          // 'category_id',
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
    }
  }
  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
  ): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    try {
      const item = await this.serviceModel.findOne({
        where: { id: id },
      });
      if (!item) {
        throw new NotFoundException('item  not found');
      }
      const duplicateName = await this.serviceModel.findOne({
        where: {
          service_name: updateServiceDto.service_name,
        },
      });
      if (duplicateName) {
        throw new ConflictException('Duplicate  name!');
      }
      const updated = await this.serviceModel.update(
        {
          service_name: updateServiceDto.service_name,
          service_description: updateServiceDto.service_description,
          startTime: updateServiceDto.startTime,
          endTime: updateServiceDto.endTime,
          brand_id: updateServiceDto.brand_id,
          category_id: updateServiceDto.category_id,
          location_id: updateServiceDto.location_id,
          updateAt: new Date(),
        },
        {
          where: { id: id },
        },
      );
      return updated;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error update item ', error);
    }
  }
  async delete(
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
    }
  }
}

import { Brand } from 'src/database/dabaseModels/brand.entity';
import { IBrand } from './brand.interface';
import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandPagination } from './dto/pagination-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
@Injectable()
export class BrandRepository implements IBrand {
  constructor(
    @Inject('BRAND_REPOSITORY')
    private readonly brandModel: typeof Brand,
    private readonly cloudinaryService: CloudinaryService,
  ) { };

  public async createBrand(
    createBrandDto: CreateBrandDto & { image: Express.Multer.File },
  ): Promise<
    | object
    | InternalServerErrorException
    | HttpException
    | ConflictException
    | NotFoundException
  > {
    try {
      const existingBrand = await this.brandModel.findOne({
        where: {
          brand_name: createBrandDto.brand_name,
        },
      });

      if (existingBrand) {
        throw new ConflictException(
          'Brand already exists, choose other names!',
        );
      };

      let imageUrl = null;

      if (createBrandDto.image) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createBrandDto.image,
          );

          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.log('error from upload', error);
          throw new InternalServerErrorException(error.message);
        };
      } else {
        throw new NotFoundException('There is no image uploaded!');
      };

      const newBrand = await this.brandModel.create({
        brand_name: createBrandDto.brand_name,
        brand_description: createBrandDto.brand_description,
        image: imageUrl,
      });

      return newBrand;
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    };
  };

  public async findAllBrand(
    pagination: BrandPagination,
  ): Promise<
    | { data: object[]; totalCount: number }
    | InternalServerErrorException
    | BadRequestException
  > {
    try {
      console.log('pagination: ', pagination.limit, pagination.page);
      if (pagination.limit === undefined && pagination.page === undefined) {
        console.log('no pagination');
        const allBrands = await this.brandModel.findAll();

        return {
          data: allBrands,
          totalCount: 1,
        };
      };

      if (
        (pagination.page && !pagination.limit) ||
        (!pagination.page && pagination.limit)
      ) {
        console.log('one pagination');
        throw new BadRequestException(
          'Page and limit query parameters are required',
        );
      };

      console.log('pagination');
      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;

      const findOptions: any = {
        attributes: [
          'id',
          'brand_name',
          'brand_description',
          'image',
          'status',
          'created_at',
          'updated_at',
        ],
      };

      if (limit !== null) {
        findOptions.limit = limit;
        findOptions.offset = (page - 1) * limit;
      };

      const { count, rows: allBrand } = await this.brandModel.findAndCountAll(findOptions);
      const numberOfPage = Math.ceil(count / pagination.limit);

      return {
        data: allBrand,
        totalCount: numberOfPage,
      };

    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(error.message);
    };
  };

  public async findOneBrand(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const brand = await this.brandModel.findOne({
        where: { id: id },
      });

      if (!brand) {
        throw new NotFoundException('This brand does not exist!');
      };

      return brand;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      };

      throw new InternalServerErrorException(error.message);
    };
  };

  public async updateBrand(
    id: string,
    updateBrandDto: UpdateBrandDto,
  ): Promise<
    | object
    | InternalServerErrorException
    | HttpException
    | NotFoundException
    | ConflictException
  > {
    try {
      const promises = [
        this.brandModel.findOne({
          where: { id: id },
        }),

        this.brandModel.findOne({
          where: { brand_name: updateBrandDto.brand_name },
        }),
      ];

      const [brand, duplicateName] = await Promise.all(promises);

      if (!brand) {
        throw new NotFoundException('This brand does not exist!');
      };

      if (duplicateName) {
        throw new ConflictException('Duplicate brand name!');
      };

      const brandUpdated = await this.brandModel.update(
        {
          brand_name: updateBrandDto.brand_name,
          brand_description: updateBrandDto.brand_description,
          updateAt: new Date(),
        },
        {
          where: { id: id },
        },
      );

      return brandUpdated;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException || error instanceof ConflictException) {
        throw error;
      };

      throw new InternalServerErrorException(error.message);
    }
  };

  public async deleteBrand(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const brand = await this.brandModel.findOne({
        where: { id: id },
      });

      if (!brand) {
        throw new NotFoundException('This brand does not exist!');
      }

      await this.brandModel.destroy({
        where: { id: id },
      });

      return {
        message: 'This brand is deleted successfully!',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      };

      throw new InternalServerErrorException(error.message);
    };
  };
};

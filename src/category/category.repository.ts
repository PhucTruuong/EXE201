import {
  InternalServerErrorException,
  HttpException,
  ConflictException,
  NotFoundException,
  Inject,
  BadRequestException
} from '@nestjs/common';
import { ICategory } from './category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from 'src/database/dabaseModels/category.entity';
import { CategoryPagination } from './dto/category-pagination.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { error } from 'console';
// import { find } from 'rxjs';

export class CategoryRepository implements ICategory {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryModel: typeof Category,
    private readonly cloudinaryService: CloudinaryService,
  ) { }
  public async createCategory(
    createCategoryDto: CreateCategoryDto & { image: Express.Multer.File },
  ): Promise<
    | object
    | InternalServerErrorException
    | HttpException
    | ConflictException
    | NotFoundException
  > {
    try {
      const existingCategory = await this.categoryModel.findOne({
        where: {
          category_name: createCategoryDto.category_name,
        },
      });

      if (existingCategory) {
        throw new ConflictException(
          'Category  already exists , choose other name',
        );
      };

      let imageUrl = null;
      if (createCategoryDto.image) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createCategoryDto.image,
          );

          imageUrl = uploadResult.secure_url;
        } catch (error) {
          console.log('error from upload', error);
          return new InternalServerErrorException(error.message);
        }
      } else {
        throw new NotFoundException('There is no image to upload!');
      }
      const newCategory = await this.categoryModel.create({
        category_name: createCategoryDto.category_name,
        category_description: createCategoryDto.category_description,
        image: imageUrl,
      });
      return newCategory;
    } catch (error) {
      console.log('error', error);
      if (error instanceof ConflictException || error instanceof NotFoundException) {
        throw error;
      };

      throw new InternalServerErrorException('Error create category', error);
    };
  };

  public async findAllCategory(
    pagination: CategoryPagination,
  ): Promise<
    | InternalServerErrorException
    | NotFoundException
    | { data: object[]; totalCount: number }
    | BadRequestException
  > {
    try {
      if (pagination.limit === undefined && pagination.page === undefined) {
        const allCategory = await this.categoryModel.findAll({
          attributes: [
            'id',
            'category_name',
            'category_description',
            'image',
            'status',
            'created_at',
            'updated_at',
          ],
        });

        return {
          data: allCategory,
          totalCount: 1,
        };
      };

      if (
        (pagination.limit === undefined && pagination.page) ||
        (pagination.limit && pagination.page === undefined)
      ) {
        throw new BadRequestException('Please provide page and limit!');
      };

      const limit = pagination?.limit ?? null;
      const page = pagination?.page ?? 1;
      const findOptions: any = {
        attributes: [
          'id',
          'category_name',
          'category_description',
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

      const { count, rows: allCategory } = await this.categoryModel.findAndCountAll(findOptions);

      const numberOfPage = Math.ceil(count / pagination.limit);

      return {
        data: allCategory,
        totalCount: numberOfPage,
      };

    } catch (error) {
      console.log(error);
      if (error instanceof BadRequestException) {
        throw error;
      };

      throw new InternalServerErrorException(error.message);
    };
  };

  public async findOneCategory(
    id: string,
  ): Promise<
    object | InternalServerErrorException | HttpException | NotFoundException
  > {
    try {
      const category = await this.categoryModel.findOne({
        where: { id: id },
      });

      if (!category) {
        throw new NotFoundException('category  not found');
      };

      return category;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    };
  };

  public async deleteCategory(
    id: string,
  ): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    try {
      const category = await this.categoryModel.findOne({
        where: { id: id },
      });
      if (!category) {
        throw new NotFoundException('This category does not exist!');
      };

      await this.categoryModel.destroy({
        where: { id: id },
      });

      return {
        message: 'This category is deleted successfully!',
      };
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      };
      throw new InternalServerErrorException(error.message);
    };
  };

  public async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    try {
      const category = await this.categoryModel.findOne({
        where: { id: id },
      });

      if (!category) {
        throw new NotFoundException('This category does not exist!');
      };

      const categoryUpdate = await this.categoryModel.update(
        {
          category_name: updateCategoryDto.category_name,
          category_description: updateCategoryDto.category_description,
          updateAt: new Date(),
        },
        {
          where: { id: id },
        },
      );

      return categoryUpdate;
    } catch (error) {
      console.log(error);
      if (error instanceof NotFoundException) {
        throw error;
      };
      
      throw new InternalServerErrorException('Error update one pet ', error);
    };
  };
};

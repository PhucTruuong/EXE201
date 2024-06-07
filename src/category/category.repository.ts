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
// import { find } from 'rxjs';

export class CategoryRepository implements ICategory {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryModel: typeof Category,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
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
      }
      let imageUrl = null;
      if (createCategoryDto.image) {
        try {
          const uploadResult = await this.cloudinaryService.uploadFile(
            createCategoryDto.image,
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
        return new NotFoundException('There is no image to upload!');
      }
      const newCategory = await this.categoryModel.create({
        category_name: createCategoryDto.category_name,
        category_description: createCategoryDto.category_description,
        image: imageUrl,
      });
      return newCategory;
    } catch (error) {
      console.log('error', error);
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
      if(pagination.limit === undefined && pagination.page === undefined) {
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
        if (!allCategory) {
          return new NotFoundException('No category found!');
        } else {
          return {
            data: allCategory,
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

      if (!allCategory || count === 0) {
        return new NotFoundException('No category found!');
      } else {
        return {
          data: allCategory,
          totalCount: numberOfPage,
        };
      }
    } catch (error) {
      console.log(error);
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
      throw new InternalServerErrorException(
        'Error find one  category ',
        error,
      );
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
        throw new NotFoundException('category  not found');
      };

      await this.categoryModel.destroy({
        where: { id: id },
      });

      return {
        message: 'category  deleted successfully',
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error delete one category',
        error,
      );
    };
  };

  public async updateCategory(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<
    object | InternalServerErrorException | NotFoundException | HttpException
  > {
    try {
      const pet = await this.categoryModel.findOne({
        where: { id: id },
      });
      if (!pet) {
        throw new NotFoundException('pet  not found');
      }
      const CategoryUpdate = await this.categoryModel.update(
        {
          category_name: updateCategoryDto.category_name,
          category_description: updateCategoryDto.category_description,
          updateAt: new Date(),
        },
        {
          where: { id: id },
        },
      );
      return CategoryUpdate;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error update one pet ', error);
    };
  };
};

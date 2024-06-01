import {
  InternalServerErrorException,
  HttpException,
  ConflictException,
  NotFoundException,
  Inject,
  HttpStatus,
} from '@nestjs/common';
import { ICategory } from './category.interface';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from 'src/database/dabaseModels/category.entity';
import { CategoryPagination } from './dto/category-pagination.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { find } from 'rxjs';

export class CategoryRepository implements ICategory {
  constructor(
    @Inject('CATEGORY_REPOSITORY')
    private readonly categoryModel: typeof Category,
    private readonly cloudinaryService: CloudinaryService,
  ) {}
  async createCategory(
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
        return new NotFoundException('not have images');
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
    }
  }
  async findAllCategory(
    pagination: CategoryPagination,
  ): Promise<
    | InternalServerErrorException
    | HttpException
    | { data: object[]; totalCount: number }
  > {
    try {
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
      }
      const { count, rows: allCategory } =
        await this.categoryModel.findAndCountAll(findOptions);
      if (!allCategory || count === 0) {
        return new HttpException('No Pet  found!', HttpStatus.NOT_FOUND);
      } else {
        return {
          data: allCategory,
          totalCount: count,
        };
      }
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error fetching category ', error);
    }
  }
  async findOneCategory(
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
      }
      return category;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Error find one  category ',
        error,
      );
    }
  }
  async deleteCategory(
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
      }
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
    }
  }
  async updateCategory(
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
    }
  }
}

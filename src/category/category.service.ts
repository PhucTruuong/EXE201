import { ConflictException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryRepository } from './category.repository';
import { CategoryPagination } from './dto/category-pagination.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) { }
  public async findAllCategory(pagination: CategoryPagination): Promise<{
    data: object[],
    totalCount: number
  } | InternalServerErrorException | HttpException> {

    return this.categoryRepository.findAllCategory(pagination);
  }

  public async createCategory(createCategoryDto: CreateCategoryDto & { image: Express.Multer.File } ): Promise<object | InternalServerErrorException | HttpException | ConflictException> {
    return this.categoryRepository.createCategory(createCategoryDto)
  }
  public async findOneCategory(id: string): Promise<object | InternalServerErrorException | HttpException> {
    return this.categoryRepository.findOneCategory(id)
  }
  public async deleteCategory(id: string): Promise<object | InternalServerErrorException | HttpException> {
    return this.categoryRepository.deleteCategory(id)

  }
  public async updateCategory(id: string, UpdateCategoryDto: UpdateCategoryDto): Promise<object | InternalServerErrorException | HttpException> {
    return this.categoryRepository.updateCategory(id,UpdateCategoryDto)
  }
}

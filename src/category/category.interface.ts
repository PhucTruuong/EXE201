import {
    InternalServerErrorException,
    HttpException,
    ConflictException,
    NotFoundException,
    BadRequestException
  } from '@nestjs/common';import { CategoryPagination } from "./dto/category-pagination.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";


export interface ICategory {
    findAllCategory(pagination: CategoryPagination): Promise<{
        data: object[],
        totalCount: number
    } | InternalServerErrorException | NotFoundException | BadRequestException>;
    createCategory(createCategoryDto : CreateCategoryDto): Promise<
        object | InternalServerErrorException | HttpException | ConflictException | NotFoundException
    >
    findOneCategory(id: string):Promise<object | InternalServerErrorException | HttpException | NotFoundException>
    updateCategory(id: string,updateCategoryDto: UpdateCategoryDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException>
    deleteCategory(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> 
}
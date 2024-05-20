import { InternalServerErrorException, HttpException, ConflictException, NotFoundException, Inject, HttpStatus } from "@nestjs/common";
import { ICategory } from "./category.interface";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { Category } from "src/database/dabaseModels/category.entity";
import { CategoryPagination } from "./dto/category-pagination.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

export class CategoryRepository implements ICategory {
    constructor(
        @Inject('CATEGORY_REPOSITORY')
        private readonly categoryModel: typeof Category
    ) { }
    async createCategory(createCategoryDto: CreateCategoryDto): Promise<object | InternalServerErrorException | HttpException | ConflictException | NotFoundException> {

        try {
            const existingCategory = await this.categoryModel.findOne({
                where: {
                    category_name: createCategoryDto.category_name
                }
            })
            if (existingCategory) {
                throw new ConflictException("Category  already exists , choose other name");
            }
            const newCategory = await this.categoryModel.create({
                category_name: createCategoryDto.category_name,
                category_description: createCategoryDto.category_description


            })
            return newCategory
        } catch (error) {
            console.log("error", error)
            throw new InternalServerErrorException("Error create category", error)
        };
    }
   async findAllCategory(pagination: CategoryPagination): Promise<InternalServerErrorException | HttpException | { data: object[]; totalCount: number; }> {
        try {
            const { count, rows: allPet } = await this.categoryModel.findAndCountAll({
                attributes: [
                    'id',
                    'category_name',
                    'category_description',
                    'status',
                    'created_at',
                    'updated_at',
                ],
                limit: pagination.limit,
                offset: (pagination.page - 1) * pagination.limit
            });
            if (!allPet || count === 0) {
                return new HttpException('No Pet  found!', HttpStatus.NOT_FOUND);
            } else {
                return {
                    data: allPet,
                    totalCount: count
                };
            };
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error fetching category ", error)
        };
    }
  async  findOneCategory(id: string): Promise<object | InternalServerErrorException | HttpException | NotFoundException> {
        try {
            const category = await this.categoryModel.findOne({
                where: { id: id }
            })
            if (!category) {
                throw new NotFoundException("category  not found");
            }
            return category
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error find one  category ", error)
        };
    }
  async  deleteCategory(id: string): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const category = await this.categoryModel.findOne({
                where: { id: id }
            })
            if (!category) {
                throw new NotFoundException("category  not found");
            }
            await this.categoryModel.destroy({
                where: { id: id }
            })
            return {
                message: "category  deleted successfully"
            }
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error delete one pet ", error)
        };
    }
   async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<object | InternalServerErrorException | NotFoundException | HttpException> {
        try {
            const pet = await this.categoryModel.findOne({
                where: { id:id }
            })
            if (!pet) {
                throw new NotFoundException("pet  not found");
            }
            const PetUpdated = await this.categoryModel.update(

                {
                    category_name: updateCategoryDto.category_name,
                    category_description: updateCategoryDto.category_description,    
                    updateAt: new Date(),
                },
                {
                    where: { id: id }
                }
            )
            return PetUpdated
        } catch (error) {
            console.log(error);
            throw new InternalServerErrorException("Error update one pet ", error)
        };
    }
}
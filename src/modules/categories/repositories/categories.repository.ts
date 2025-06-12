import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const category = this.repository.create(createCategoryDto);
    return await this.repository.save(category);
  }

  async findAll(): Promise<Category[]> {
    return await this.repository.find();
  }

  async findOne(id: string): Promise<Category | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(
    category: Category,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.repository.merge(category, updateCategoryDto);
    return await this.repository.save(category);
  }

  async remove(category: Category): Promise<void> {
    await this.repository.remove(category);
  }
}

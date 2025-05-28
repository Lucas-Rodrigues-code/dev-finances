import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto, UpdateUserDto } from '../dto';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(createUserDto.email);
    
    if (existingUser) {
      throw new ConflictException('Email já está em uso');
    }

    return this.userRepository.create(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.email) {
      const existingUser = await this.userRepository.findByEmail(updateUserDto.email);
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email já está em uso');
      }
    }

    const user = await this.userRepository.update(id, updateUserDto);
    
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.userRepository.delete(id);
    
    if (!deleted) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
} 
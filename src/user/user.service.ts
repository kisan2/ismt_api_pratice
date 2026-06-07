import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repo: Repository<User>
  ) {}

  async create(email: string, password: string,username:string): Promise<User> {
    const existing = await this.repo.findOne({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');

    const hashPassword = await bcrypt.hash(password, 10);
    const user = this.repo.create({ email, password: hashPassword,username });
    return this.repo.save(user);
  }

    async find() {
    return await this.repo.find();
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }


  async findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async updateRefreshToken(userId: number, token: string | null) {
    return this.repo.update(userId, { refreshToken: token });
  }

  async countUsers(): Promise<number> { 
    return this.repo.count();
  }
}